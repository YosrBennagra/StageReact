import { Role } from './Enum/Role';

class User {
  constructor() {
    this.userId = '';
    this.username = '';
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.password = '';
    this.fasecret = '';
    this.is2FaEnabled = false;
    this.isEmailConfirmed = false;
    this.role = Role;
    this.settings = null;
  }
}

export default User;
