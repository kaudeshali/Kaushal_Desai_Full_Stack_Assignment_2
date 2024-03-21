// Importing necessary modules and packages.
const express = require('express')
require("dotenv").config()
const app = express()
const { GraphQLScalarType } = require('graphql');
const { ApolloServer } = require('apollo-server-express')
const { Kind } = require("graphql/language");
const { dbConnection, insertEmployee, fetchEmployee, fetchEmployeeById, deleteEmployee, updateEmployee ,getNextEmployeeID} = require('./db');

// Defining custom scalar types.
const TypeDate = new GraphQLScalarType({
    name: "TypeDate",
    description: "date as a scalar",
    serialize(value) {
      return value.toISOString();
    },
    parseValue(value) {
      const res = new Date(value);
      if(Number.isNaN(res.getTime()) ){
        return undefined 
      }
      else{
        return res;
      }
    },
    parseLiteral(val) {
      if (val.kind === Kind.STRING) {
        const value = new Date(val.value);
        if(Number.isNaN(res.getTime()) ){
          return undefined 
        }
        else{
          return value;
        }
      }
      return undefined;
    },
});

const TypeId = new GraphQLScalarType({
    name: 'TypeId',
    description: 'MongoDB TypeId as a scalar',
  
    serialize(value) {
      return value.toString();
    },
  
    parseValue(value) {
      return TypeId(value);
    },
  
    parseLiteral(res) {
      if (res.kind === 'StringValue') {
        return TypeId(res.value);
      }
      return null;
    },
  });

// GraphQL schema.
const schema = `
    
    scalar TypeId
    scalar TypeDate
    
    input employeeInputType {
      firstName: String
      dateOfJoining: TypeDate
      lastName: String
      age: Int
      title: String
      department: String
      employeeType: String
      currentStatus: Int
      EmployeeID: Int
  }

    type Employee {
        _id: TypeId
        lastName: String
        firstName: String
        age: Int
        dateOfJoining: TypeDate
        title: String
        department: String
        employeeType: String
        currentStatus: Int
        EmployeeID: Int
    }

    type Query {
      getEmployeeData: [Employee]
      getEmployeeById(EmployeeID: Int!): Employee
  }

  type Mutation {
      addEmploy(result: employeeInputType): Employee!
      deleteEmployeeByID(EmployeeID: Int!): Boolean
      updateEmployeeByID(EmployeeID: Int!, result: employeeInputType): Boolean
  }
`
// GraphQL resolver functions.
async function getEmployees(){
   const employees = await fetchEmployee();
    return employees;
}

async function addEmploy(_,{result}){
    try{
      result.EmployeeID = await getNextEmployeeID("EmployeeID")
      return await insertEmployee(result);
    }
    catch(e){
        console.log("Error!! while fetching the employee Details", e)
    }
}
async function getEmployeeById(_, { EmployeeID }) {
  const employee = await fetchEmployeeById(EmployeeID);
  return employee;
} 

async function deleteEmployeeByID(_, { EmployeeID }) {
  const result = await deleteEmployee(EmployeeID);
  return result.success;
}

async function updateEmployeeByID(_, { EmployeeID, result }) {
  const response = await updateEmployee(EmployeeID, result);
  return response.success;
}

// GraphQL resolvers.
const resolvers = {
  Query: { 
      getEmployeeData: getEmployees,
      getEmployeeById,
  },
  Mutation: {
      addEmploy,
      deleteEmployeeByID,
      updateEmployeeByID,
  },
  TypeDate: TypeDate,
  TypeId: TypeId,
}

// Creating ApolloServer instance.
const apiServer = new ApolloServer({ typeDefs: schema, resolvers })

// Serving static files.
app.use(express.static('public'))

// Starting ApolloServer and Express server.
apiServer.start().then(res => {

    apiServer.applyMiddleware({ app, path: '/graphql' });
    dbConnection();

    app.listen(process.env.API_PORT, () => console.log('EMS Application is running at port 4545: '+ process.env.API_PORT));

})
