// Importing necessary modules from React library and external libraries.
import React from "react"
import { Routes, Route, Link } from "react-router-dom"
import EmployeeDirectory from "./EmployeeDirectory.jsx"
import EmployeeCreate from "./EmployeeCreate.jsx"
import EmployeeDetails from "./EmployeeDetails.jsx"

// Class component for managing navigation within the application.
export default class Navigation extends React.Component {
	render() {
		return (
			<>
				<div className="navbar">
					<Link to="/">Home</Link>
					<Link to="/addEmployee">Create Employee</Link>
				</div>
				<Routes>
					<Route path="/" element={<EmployeeDirectory />} />
					<Route path="/list" element={<EmployeeDirectory />} />
					<Route path="/addEmployee" element={<EmployeeCreate />} />
					<Route path="/list/:id" element={<EmployeeDetails />} />
					<Route path="/list/search/:filter" element={<EmployeeDirectory />} />
					<Route path="*" element={<h2>Page not Found 404</h2>} />
				</Routes>
			</>
		)
	}
}