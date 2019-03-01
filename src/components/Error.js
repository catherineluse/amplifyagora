import React from "react";

const Error = ({ errors }) => (
    <pre className="error">
      {errors.map(( err, i ) => {
          return (
            <div
              key={i}>{err.message}
            >
            </div>
          )
       })}
    </pre>
)

export default Error;
