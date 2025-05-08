import React from 'react'

const ErrorDisplay = ({ errors }) => (
    errors.split('\n').map((error, key) =>
        <p key={key}>{error}</p>)
)

export default ErrorDisplay;