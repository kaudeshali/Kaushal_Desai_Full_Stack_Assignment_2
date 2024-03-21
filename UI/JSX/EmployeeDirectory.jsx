// Importing necessary modules from React library and local files.
import React from "react"
import EmployeeTable from "./EmployeeTable.jsx"
import EmployeeSearch from "./EmployeeSearch.jsx"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"

// Function to pass URL parameters as props to the component.
function NavigationParams(EmployeeDirectory) {
	return (props) => <EmployeeDirectory {...props} params={useParams()} />
}

// Class component for managing employee directory.
class EmployeeDirectory extends React.Component {
	constructor() {
		super()
		this.state = { employeeData: [] }
		this.loadEMp = this.loadEMp.bind(this)
		this.deleteEmployee = this.deleteEmployee.bind(this)
	}

    // Fetching employee data when the component mounts.
	componentDidMount() {
		this.loadEMp()
	}

    // Function to fetch employee data.
	loadEMp = () => {
		const fetchQuery =
            `query getEmployeeData {
            getEmployeeData {
              _id
              age
              currentStatus
              dateOfJoining
              department
              employeeType
              firstName
              lastName
              title
              EmployeeID
            }
          }`
		this.fetchEmployeeDta(fetchQuery)
	}

    // Function to fetch employee data from the server.
	async fetchEmployeeDta(query) {
		const dbResponse = await graphqlRequest(query)
		this.setState(
			{
				employeeData: dbResponse.getEmployeeData
			}
		)
	}

    // Function to delete an employee.
	deleteEmployee = async (id) => {
		const deleteQuery = `
            mutation deleteEmployee($EmployeeID: Int!) {
                deleteEmployeeByID(EmployeeID: $EmployeeID)
            }
        `

		try {
			const variables = { EmployeeID: id }
			await graphqlRequest(deleteQuery, variables)
			alert("Employee deleted")
			this.loadEMp()
		} catch (error) {
			console.error("Error deleting employee:", error.message)
		}
	}


    // Function to render the component.
	render() {
		let employees = []
		const employee = this.state.employeeData.slice()

		// Filter employees based on employee type parameter
		if (
			typeof this.props.params.filter === "undefined" ||
            this.props.params.filter.toLowerCase() === "all"
		) {
			employees = this.state.employeeData
		} else {
			employees = employee.filter((c) => c.employeeType === this.props.params.filter)
		}

		return (
			<div className="emp-directory-container">
				<h1>Employee Directory</h1>
				<EmployeeSearch />
				<EmployeeTable data={employees} deletefunction={this.deleteEmployee} />
			</div>
		)
	}
}

// Wrapping EmployeeDirectory component with NavigationParams to pass URL params as props.
export default NavigationParams(EmployeeDirectory)

// Function to make a GraphQL request to the server.
async function graphqlRequest(queryString, variableValue = {}) {
	try {
		const result = await fetch("http://localhost:8787/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query: queryString, variables: variableValue }),
		})

		const response = await result.json()
		if (response.createFormError) {
			handleGraphQLcreateFormError(response.createFormError)
		}
		return response.data
	} catch (e) {
		alert(`Error in processing request: ${e.message}`)
	}
}

// Function to handle errors from GraphQL server.
function handleGraphQLcreateFormError(createFormError) {
	const error = createFormError[0]
	if (error.extensions.code === "BAD_USER_INPUT") {
		const details = error.extensions.createFormError.join("\n ")
		alert(`${error.message}:\n ${details}`)
	} else {
		alert(`${error.extensions.code}: ${error.message}`)
	}
}

// PropTypes for EmployeeDirectory component.
EmployeeDirectory.propTypes = {
	params: PropTypes.shape({
		filter: PropTypes.string,
	}),
}
  
// Set display name for the component.
EmployeeDirectory.displayName = "EmployeeDirectory"