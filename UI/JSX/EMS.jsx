// Importing necessary modules from React library and external libraries.
import React from "react"
import { createRoot } from "react-dom"
import { HashRouter } from "react-router-dom"
import Navigation from "./Navigation.jsx"

// Creating a root element where the React application will be rendered.
const root = createRoot(document.getElementById("content"))

// Rendering the Navigation component wrapped inside HashRouter component to enable routing.
root.render(<HashRouter><Navigation/></HashRouter>)