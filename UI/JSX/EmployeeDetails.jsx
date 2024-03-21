// Importing necessary modules from React library and external libraries.
import React from "react"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"

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

        // Logging GraphQL errors if any.
		if (response.errors) {
			console.error("GraphQL Error:", response.errors)
		}

        // Returning the data from the response.
		return response.data
	} catch (e) {
        // Logging if there is an error during the request.
		console.error(`Error!! While processing the request: ${e.message}`)
	}
}


// Function to get parameters from the URL and pass them as props to the component.
function getParams(EmployeeDetails) {
	return (props) => <EmployeeDetails {...props} param={useParams()} />
}

// Class component for displaying employee details and updating employee information.
class EmployeeDetails extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			employeeData: null,
			updateFields: {
				title: "",
				department: "",
				currentStatus: 1,
			},
		}
	}

    // Fetching employee details by ID when the component mounts.
	componentDidMount() {
		const { id } = this.props.param
		this.fetchEmployeeById(id)
	}

    // Function to fetch employee details by ID.
	async fetchEmployeeById(id) {
		const fetchQuery = `
            query getEmployeeById($EmployeeID: Int!) {
                getEmployeeById(EmployeeID: $EmployeeID) {
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
            }
        `

		const variables = { EmployeeID: parseInt(id, 10) }

		try {
			const dbResponse = await graphqlRequest(fetchQuery, variables)

			if (dbResponse && dbResponse.getEmployeeById) {
				this.setState({
					employeeData: dbResponse.getEmployeeById,
					updateFields: {
						title: dbResponse.getEmployeeById.title || "", // Default value for Title
						department: dbResponse.getEmployeeById.department || "", // Default value for Department
						currentStatus: dbResponse.getEmployeeById.currentStatus || 1, // Default value for "Working"
					},
				})
			} else {
				console.error("Error fetching employee details: Response format is incorrect", dbResponse)
			}
		} catch (error) {
			console.error("Error fetching employee details:", error.message)
		}
	}

    // Function to handle changes in the update fields.
	handleUpdateFieldChange = (fieldName, value) => {
		this.setState((prevState) => ({
			updateFields: {
				...prevState.updateFields,
				[fieldName]: value,
			},
		}))
	}

    // Function to update employee information.
	updateEmployee = async () => {
		const { id } = this.props.param
		const { title, department, currentStatus } = this.state.updateFields

		const updateQuery = `
            mutation updateEmployeeByID($EmployeeID: Int!,$result: employeeInputType) {
                updateEmployeeByID(
                    EmployeeID: $EmployeeID,
                    result: $result
                )
            }
        `

		const variables = {
			EmployeeID: parseInt(id, 10),
			result:{
				title,
				department,
				currentStatus,}
		}

		try {
			await graphqlRequest(updateQuery, variables)
			console.log("Employee updated successfully!")
			alert("Employee updated successfully!")
		} catch (error) {
			console.error("Error updating employee:", error.message)
		}
		this.fetchEmployeeById(id)
	}


    // Function to render employee details and update form.
	renderTable() {
		const { employeeData, updateFields } = this.state
		if (!employeeData) {
			return <div className="error-message">Employee not found</div>
		}

		return (
			<div className="employee-details-container">
				<h2>Employee detail page</h2>
				<table>
					<thead>
						<tr>
							<th>Attribute</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(employeeData).map(([key, value]) => (
							<tr key={key}>
								<td>{key}</td>
								<td>{value}</td>
							</tr>
						))}
					</tbody>
				</table>
				<h3>Update details</h3>

				<div className="update-fields">
					<label htmlFor="title">Title:</label>
					<select
						id="title"
						value={updateFields.title}
						onChange={(e) => this.handleUpdateFieldChange("title", e.target.value)}
					>
						<option value="Employee">Employee</option>
						<option value="Manager">Manager</option>
						<option value="Director">Director</option>
						<option value="VP">VP</option>
					</select>

					<label htmlFor="department">Department:</label>
					<select
						id="department"
						value={updateFields.department}
						onChange={(e) => this.handleUpdateFieldChange("department", e.target.value)}
					>
						<option value="Marketing">Marketing</option>
						<option value="IT">IT</option>
						<option value="HR">HR</option>
						<option value="Engineering">Engineering</option>
					</select>

					<label htmlFor="currentStatus">Current Status:</label>
					<select
						id="currentStatus"
						value={updateFields.currentStatus}
						onChange={(e) => this.handleUpdateFieldChange("currentStatus", parseInt(e.target.value, 10))}
					>
						<option value={1}>Working</option>
						<option value={0}>Not Working</option>
					</select>
				</div>

				<button onClick={this.updateEmployee}>Update Employee</button>
			</div>
		)
	}

    // Function to render the component.
	render() {
		return (
			<>
				{this.renderTable()}
			</>
		)
	}
}


// Wrapping EmployeeDetails component with getParams to pass URL params as props.
export default getParams(EmployeeDetails)

// PropTypes for EmployeeDetails component.
EmployeeDetails.propTypes = {
	param: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
}
  
// Display name for the component.
EmployeeDetails.displayName = "EmployeeDetails"