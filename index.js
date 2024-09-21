const { prompt } = require('inquirer');
const logo = require('asciiart-logo');
const db = require('./db');

init();

function init() {
  const logoText = logo({ name: 'Employee Manager' }).render();
  console.log(logoText);
  mainMenu();
}

function mainMenu() {
  prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'View All Employees', value: 'VIEW_EMPLOYEES' },
        { name: 'View Employees By Department', value: 'VIEW_BY_DEPARTMENT' },
        { name: 'View Employees By Manager', value: 'VIEW_BY_MANAGER' },
        { name: 'Add Employee', value: 'ADD_EMPLOYEE' },
        { name: 'Remove Employee', value: 'REMOVE_EMPLOYEE' },
        { name: 'Update Employee Role', value: 'UPDATE_EMPLOYEE_ROLE' },
        { name: 'Update Employee Manager', value: 'UPDATE_EMPLOYEE_MANAGER' },
        { name: 'View All Roles', value: 'VIEW_ROLES' },
        { name: 'Add Role', value: 'ADD_ROLE' },
        { name: 'Remove Role', value: 'REMOVE_ROLE' },
        { name: 'View All Departments', value: 'VIEW_DEPARTMENTS' },
        { name: 'Add Department', value: 'ADD_DEPARTMENT' },
        { name: 'Remove Department', value: 'REMOVE_DEPARTMENT' },
        { name: 'View Department Budgets', value: 'VIEW_BUDGETS' },
        { name: 'Quit', value: 'QUIT' },
      ],
    },
  ]).then((res) => {
    switch (res.action) {
      case 'VIEW_EMPLOYEES':
        viewEmployees();
        break;
      case 'VIEW_BY_DEPARTMENT':
        viewEmployeesByDepartment();
        break;
      case 'VIEW_BY_MANAGER':
        viewEmployeesByManager();
        break;
      case 'ADD_EMPLOYEE':
        addEmployee();
        break;
      case 'REMOVE_EMPLOYEE':
        removeEmployee();
        break;
      case 'UPDATE_EMPLOYEE_ROLE':
        updateEmployeeRole();
        break;
      case 'UPDATE_EMPLOYEE_MANAGER':
        updateEmployeeManager();
        break;
      case 'VIEW_DEPARTMENTS':
        viewDepartments();
        break;
      case 'ADD_DEPARTMENT':
        addDepartment();
        break;
      case 'REMOVE_DEPARTMENT':
        removeDepartment();
        break;
      case 'VIEW_ROLES':
        viewRoles();
        break;
      case 'ADD_ROLE':
        addRole();
        break;
      case 'REMOVE_ROLE':
        removeRole();
        break;
      case 'VIEW_BUDGETS':
        viewDepartmentBudgets();
        break;
      default:
        quit();
    }
  });
}

function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => console.table(rows))
    .then(() => mainMenu());
}

function viewEmployeesByDepartment() {
  db.findAllDepartments().then(({ rows }) => {
    const choices = rows.map(({ id, name }) => ({ name, value: id }));
    prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department:',
        choices,
      },
    ])
      .then((res) => db.findAllEmployeesByDepartment(res.departmentId))
      .then(({ rows }) => console.table(rows))
      .then(() => mainMenu());
  });
}

function viewEmployeesByManager() {
  db.findAllEmployees().then(({ rows }) => {
    const choices = rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Select a manager:',
        choices,
      },
    ])
      .then((res) => db.findAllEmployeesByManager(res.managerId))
      .then(({ rows }) => {
        if (rows.length === 0) {
          console.log('No direct reports found.');
        } else {
          console.table(rows);
        }
      })
      .then(() => mainMenu());
  });
}

function addEmployee() {
  prompt([
    { name: 'first_name', message: 'Employee first name:' },
    { name: 'last_name', message: 'Employee last name:' },
  ]).then((res) => {
    const { first_name, last_name } = res;
    db.findAllRoles().then(({ rows }) => {
      const roleChoices = rows.map(({ id, title }) => ({ name: title, value: id }));
      prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select a role:',
        choices: roleChoices,
      }).then((res) => {
        const roleId = res.roleId;
        db.findAllEmployees().then(({ rows }) => {
          const managerChoices = rows.map(
            ({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id })
          );
          managerChoices.unshift({ name: 'None', value: null });
          prompt({
            type: 'list',
            name: 'managerId',
            message: 'Select a manager:',
            choices: managerChoices,
          })
            .then((res) => {
              const employee = {
                first_name,
                last_name,
                role_id: roleId,
                manager_id: res.managerId,
              };
              db.createEmployee(employee);
            })
            .then(() => console.log(`Added ${first_name} ${last_name}`))
            .then(() => mainMenu());
        });
      });
    });
  });
}

function removeEmployee() {
  db.findAllEmployees().then(({ rows }) => {
    const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt({
      type: 'list',
      name: 'employeeId',
      message: 'Select an employee to remove:',
      choices: employeeChoices,
    })
      .then((res) => db.removeEmployee(res.employeeId))
      .then(() => console.log('Employee removed.'))
      .then(() => mainMenu());
  });
}

function updateEmployeeRole() {
  db.findAllEmployees().then(({ rows }) => {
    const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt({
      type: 'list',
      name: 'employeeId',
      message: 'Select an employee to update:',
      choices: employeeChoices,
    }).then((res) => {
      const employeeId = res.employeeId;
      db.findAllRoles().then(({ rows }) => {
        const roleChoices = rows.map(({ id, title }) => ({ name: title, value: id }));
        prompt({
          type: 'list',
          name: 'roleId',
          message: 'Select a new role:',
          choices: roleChoices,
        })
          .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
          .then(() => console.log('Role updated.'))
          .then(() => mainMenu());
      });
    });
  });
}

function updateEmployeeManager() {
  db.findAllEmployees().then(({ rows }) => {
    const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt({
      type: 'list',
      name: 'employeeId',
      message: 'Select an employee to update manager:',
      choices: employeeChoices,
    }).then((res) => {
      const employeeId = res.employeeId;
      db.findAllPossibleManagers(employeeId).then(({ rows }) => {
        const managerChoices = rows.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        }));
        prompt({
          type: 'list',
          name: 'managerId',
          message: 'Select a new manager:',
          choices: managerChoices,
        })
          .then((res) => db.updateEmployeeManager(employeeId, res.managerId))
          .then(() => console.log('Manager updated.'))
          .then(() => mainMenu());
      });
    });
  });
}

function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => console.table(rows))
    .then(() => mainMenu());
}

function addRole() {
  db.findAllDepartments().then(({ rows }) => {
    const departmentChoices = rows.map(({ id, name }) => ({ name, value: id }));
    prompt([
      { name: 'title', message: 'Role name:' },
      { name: 'salary', message: 'Role salary:' },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select department:',
        choices: departmentChoices,
      },
    ]).then((role) => {
      db.createRole(role)
        .then(() => console.log(`Added ${role.title}`))
        .then(() => mainMenu());
    });
  });
}

function removeRole() {
    db.findAllRoles().then(({ rows }) => {
      const roleChoices = rows.map(({ id, title }) => ({ name: title, value: id }));
      prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select a role to remove:',
        choices: roleChoices,
      })
        .then((res) => db.removeRole(res.roleId))
        .then(() => console.log('Role removed.'))
        .then(() => mainMenu());
    });
  }
  
  function viewDepartments() {
    db.findAllDepartments()
      .then(({ rows }) => console.table(rows))
      .then(() => mainMenu());
  }
  
  function addDepartment() {
    prompt([
      { name: 'name', message: 'Department name:' },
    ]).then((res) => {
      const department = { name: res.name };
      db.createDepartment(department)
        .then(() => console.log(`Added ${department.name} to the database`))
        .then(() => mainMenu());
    });
  }
  
  function removeDepartment() {
    db.findAllDepartments().then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({ name, value: id }));
      prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to remove:',
        choices: departmentChoices,
      })
        .then((res) => db.removeDepartment(res.departmentId))
        .then(() => console.log('Department removed.'))
        .then(() => mainMenu());
    });
  }
  
  function viewDepartmentBudgets() {
    db.viewDepartmentBudgets()
      .then(({ rows }) => console.table(rows))
      .then(() => mainMenu());
  }
  
  function quit() {
    console.log('Goodbye!');
    process.exit();
  }
  