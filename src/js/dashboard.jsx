
import React from "react";
import ReactDOM from "react-dom";

import { ProfileEditForm } from "./containers/profileEditForm";

window.addEventListener('load', () => {
    ReactDOM.render(<ProfileEditForm/>, document.querySelector('#profile-edit-form'));
});
