// Importing necessary modules from React library and external libraries.
import React from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"

// Function to pass navigate function from useNavigate hook as props to the component.
function NavigationParams(EmployeeSearch) {
	return (props) => <EmployeeSearch {...props} navigate={useNavigate()} />
}

// Class component for managing employee search functionality.
class EmployeeSearch extends React.Component {
	constructor(props) {
		super(props)
	}

    // Function to render the component.
	render() {
		return (
			<div className="emp-search">
				<form className="emp-search-form">
					<select
						onChange={(e) => this.props.navigate(`/list/search/${e.target.value}`)}
					>
						<option value="All">All Employees</option>
						<option value="FullTime">FullTime</option>
						<option value="PartTime">PartTime</option>
						<option value="Contract">Contract</option>
						<option value="Seasonal">Seasonal</option>
					</select>
				</form>
                
			</div>
		)
	}
}


// Prop type validation for navigate function.
EmployeeSearch.propTypes = {
	navigate: PropTypes.func.isRequired,
}
  
// Set display name for the component.
EmployeeSearch.displayName = "EmployeeSearch"

// Exporting EmployeeSearch component with NavigationParams to pass navigate function as props.
export default NavigationParams(EmployeeSearch)
