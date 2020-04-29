import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const Form = () => {
    const initialFormState = {
        name: "",
        email: "",
        password: "",
        role: "",
        terms: ""
    };
    const inputChange = e => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
        validateChange(e);
        setFormState(newFormData);
    };

    const [serverError, setServerError] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const [formState, setFormState] = useState(initialFormState);

    const [errors, setErrors] = useState(initialFormState);

    const formSchema = yup.object().shape({
        name: yup.string().required("Name is a required field"),
        email: yup.string().email("Must be a valid email address")
            .required("Must include email address"),
        password: yup.string().min(8, "Password must be 8 characters long")
            .required("Password is required"),
        role: yup.string().required("Must choose a role"),
        terms: yup.boolean().oneOf([true], "please agree to terms of use")
        // I dont understand the syntax of the yup terms error message
    })

    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [e.target.name]: ""
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [e.target.name]: err.errors[0]
                });
            });
    };

    useEffect(() => {
        console.log("form state change")
        formSchema.isValid(formState).then(valid => {
            console.log("valid?", valid)
            setButtonDisabled(!valid);
        })
    }, [formState]);

    const [post, setPost] = useState([])
    // How do we know what to put in useState () or [] or ({}) or ([])?
    const formSubmit = e => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then(res => {
                setPost(res.data);
                console.log("success", post);
                setFormState({
                    name: "",
                    email: "",
                    password: "",
                    role: "",
                    terms: ""
                });
                setServerError("Success!");
            })
            .catch(err => {
                setServerError("Try Again");
                console.log(err.res)
            });
    }

    return (
        <form onSubmit={formSubmit}>
            {serverError ? <p className="error">{serverError}</p> : null}
            <label htmlFor="name">
                Name
                <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={inputChange}
                // Don't really understand role of value or onChange here
                />
                {errors.name.length > 0 ? (<p className="error">{errors.name}</p>) : null}
            </label>
            <label htmlFor="email">
                Email
                <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={inputChange}
                />
                {errors.email.length > 0 ? (
                    <p className="error">{errors.email}</p>
                ) : null}
            </label>
            <label htmlFor="password">
                Password
                <input
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={inputChange}
                />
                {errors.password.length > 8 ? (<p className="error">{errors.password}</p>) : null}
            </label>
            <label htmlFor="role">
                Role
                <select id="role" name="role" onChange={inputChange}>
                    {/* Why is there no value for role or terms? is it bc nothing is being typed by user? */}
                    <option value="Choose an Option">--Choose a Role--</option>
                    <option value="To pass the butter">Pass Butter</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                </select>
                {errors.role.length > 0 ? (<p className="error">{errors.role}</p>) : null}
            </label>
            <label htmlFor="terms" className="terms">
                <input
                    type="checkbox"
                    name="terms"
                    checked={formState.terms}
                    onChange={inputChange}
                />
                Terms and Conditions
            </label>
            <button disabled={buttonDisabled} type="submit">Submit</button>
        </form>
    )

}

export default Form; 