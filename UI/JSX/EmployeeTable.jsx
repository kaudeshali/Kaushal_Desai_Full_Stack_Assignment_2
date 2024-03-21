// Importing necessary modules from React library and external libraries.
import React from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

// Class component for rendering employee table.
export default class EmployeeTable extends React.Component {
	constructor(props) {
		super(props)
	}

    // Function to render the component.
	render() {
        // Checking if there are no records in the data.
		if (this.props?.data?.Length == 0) {
			return (<h1>No Records</h1>)
		}
		else {
			return (
				<div className="table-container">
					<h2>Employee Table</h2>
					<table className="emptable">
						<thead>
							<tr>
								<th>ID</th>
								<th>First Name</th>
								<th>Title</th>
								<th>Employee Type</th>
								<th>Current Status</th>
								<th>Delete</th>
								<th>Details</th>
							</tr>
						</thead>
						<tbody>
							{this.props.data?.map(res => {
								return (
									<tr key={res._id}>
										<td>{res.EmployeeID}</td>
										<td>{res.firstName}</td>
										{/* <td>{new Date(res?.dateOfJoining)?.toDateString()}</td> */}
										<td>{res.title}</td>
										<td>{res.employeeType}</td>
										<td>{res.currentStatus}</td>
										<td><button onClick={(()=>this.props.deletefunction(res.EmployeeID))}>Delete</button></td>
										<td><Link to={`/list/${res.EmployeeID}`}>View Deatils</Link></td>
									</tr>
								)
							})
							}
						</tbody>
					</table>
				</div>
			)
		}
	}
}

// Prop type validation for EmployeeTable component.
EmployeeTable.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			EmployeeID: PropTypes.number.isRequired,
			firstName: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			employeeType: PropTypes.string.isRequired,
			currentStatus: PropTypes.string.isRequired,
		})
	),
	deletefunction: PropTypes.func.isRequired,
}