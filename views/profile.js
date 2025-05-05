import html from "html-literal";
import global from "../store/global"

export default state => {
  const validateEmailButton = global.user.isVerified ? '' : html`<button id="validateEmail">Validate Email</button>`;

  return html`
    <form id="profile-form">
      <div>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" value="${global.user.email}" disabled />

      </div>
      <div>
        <label for="name">Name</label>
        <input id="name" name="name" type="text" value="${global.user.name}" />
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" name="password" type="password"  value="${global.user.password}" disabled />
        <button id="changePassword">Change Password</button>
      </div>
      <div id="newPasswordContainer" class="hidden">
        <label for="new-password">New Password</label>
        <input id="newPassword" name="new-password" type="password" />
      </div>
      <div>
        <input type="submit" value="Update" />
        <button id="submitChangePassword" class="hidden">Change Password</button>
      </div>
    </form>
  `;
}
