// Importing necessary modules from React library.
import React from "react"

// Function to make a GraphQL request to the server.
async function graphqlRequest(queryString, variableValue = {}) {
	try {
        // Sending a POST request to the GraphQL endpoint.
		const result = await fetch("http://localhost:8787/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query: queryString, variables: variableValue }),
		})

        // Parsing the response as JSON.
		const response = await result.json()

        // Handling errors from the GraphQL server.
		if (response.createFormError) {
			handleGraphQLcreateFormError(response.createFormError)
		}

        // Returning the data from the response.
		return response.data
	} catch (e) {
        // Alerting if there is an error during the request.
		alert(`Error!! While processing the request: ${e.message}`)
	}
}

// Function to handle errors returned from the GraphQL server.
function handleGraphQLcreateFormError(createFormError) {
	const error = createFormError[0]
	if (error.extensions.code === "BAD_USER_INPUT") {
		const details = error.extensions.createFormError.join("\n ")
		alert(`${error.message}:\n ${details}`)
	} else {
		alert(`${error.extensions.code}: ${error.message}`)
	}
}

// Component class for creating a new employee.
export default class EmployeeCreate extends React.Component {
	constructor(props) {
		super(props)
		const defaultDepartment = "IT"
		const defaultTitle = "Employee"
		const defaultEmployeeType = "FullTime"

        // Initial state for the form and error handling.
		this.state = {
			createFormError: {
				firstName: "",
				lastName: "",
				age: "",
				dateOfJoining: "",
			},
			firstName: "",
			age: 20,
			dateOfJoining: "",
			lastName: "",
			department: defaultDepartment,
			employeeType: defaultEmployeeType,
			title: defaultTitle,
			currentStatus: 1,
		}
	}

    // Function to add employee data to the server.
	addEmployeeData = async (employee) => {
		const getEmployeeData = { ...employee }
		let mut = { ...delete getEmployeeData.createFormError }
		getEmployeeData.dateOfJoining = new Date(getEmployeeData.dateOfJoining).toISOString()
		const query = `
        mutation addEmploy($result: employeeInputType) 
        {
         addEmploy(result: $result)
          {
           _id  
           currentStatus
           age
           department
           dateOfJoining
           employeeType
           firstName
           lastName
           title
         }
       }`
		await graphqlRequest(query, { result:getEmployeeData})
        
		alert("Employee Added Successfully.")
	}

    // Function to handle form submission for adding an employee.
	addEmp = (e) => {
		let isValidForm = true
		e.preventDefault()
       
		if (this.state?.age < 20 || this.state?.age > 70) {
			isValidForm = false
			this.setState(prevState => ({
				createFormError: { ...prevState.createFormError, age: "Age of Employee must be between 20 and 70." }
			}))
		}

		if (!this.state?.firstName) {
			isValidForm = false
			this.setState(prevState => ({
				createFormError: { ...prevState.createFormError, firstName: "First Name of employee is required." }
			}))
		}

        
		if (!this.state?.lastName) {
			isValidForm = false
			this.setState(prevState => ({
				createFormError: { ...prevState.createFormError, lastName: "Last Name of employee is required." }
			}))
		}

		if (!this.state?.dateOfJoining) {
			this.setState(prevState => ({
				createFormError: { ...prevState.createFormError, dateOfJoining: "Date of Joining of employee is required." }
			}))
			isValidForm = false
		}
		if (isValidForm) {
			this.setState({ currentStatus: 1 })
			this.addEmployeeData(this.state)
		}
		else {
			return
		}
	}

    // Rendering the employee creation form.
	render() {

		return (
			<div className="create-container">
				<h2>Create Employee</h2>
				<form className="create-form" onSubmit={this.addEmp}>
					<label>
                        First Name:
						<input type="text"
							value={this.state.firstName}
							onChange={(e) => this.setState({ firstName: e.target.value })} />
						{this.state.createFormError.firstName && (
							<span className="error-message">{this.state.createFormError.firstName}</span>
						)}
					</label>
					<label>
                        Last Name:
						<input type="text"
							value={this.state.lastName}
							onChange={(e) => this.setState({ lastName: e.target.value })} />
						{this.state.createFormError.lastName && (
							<span className="error-message">{this.state.createFormError.lastName}</span>
						)}
					</label>
					<label>
                        Age:
						<input type="number"
							value={this.state.age}
							onChange={(e) => this.setState({ age: parseInt(e.target.value) })}
							min="20"
							max="70" />
						{this.state.createFormError.age && (
							<span className="error-message">{this.state.createFormError.age}</span>
						)}
					</label>
					<label>
                        Date of Joining:
						<input type="date"
							value={this.state.dateOfJoining}
							onChange={(e) => this.setState({ dateOfJoining: e.target.value })} />
						{this.state.createFormError.dateOfJoining && (
							<span className="error-message">{this.state.createFormError.dateOfJoining}</span>
						)}
					</label>
					<label>
                        Title:
						<select value={this.state.title}
							onChange={(e) => this.setState({ title: e.target.value })}
						>
							<option value="Employee">Employee</option>
							<option value="Manager">Manager</option>
							<option value="Director">Director</option>
							<option value="VP">VP</option>
						</select>
					</label>
					<label>
                        Department:
						<select value={this.state.department}
							onChange={(e) => this.setState({ department: e.target.value })}>
							<option value="IT">IT</option>
							<option value="Marketing">Marketing</option>
							<option value="HR">HR</option>
							<option value="Engineering">Engineering</option>
						</select>
					</label>
					<label>
                        Employee Type:
						<select value={this.state.employeeType}
							onChange={(e) => this.setState({ employeeType: e.target.value })}>
							<option value="FullTime">FullTime</option>
							<option value="PartTime">PartTime</option>
							<option value="Contract">Contract</option>
							<option value="Seasonal">Seasonal</option>
						</select>
					</label>
					<button className="create-button" type="submit">Create</button>
				</form>
			</div>
		)
	}
}