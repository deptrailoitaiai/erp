
const superiorIds = [{ id: 1 }, { id: 2 }, { id: 3 }]
const formId = 'a';
const userFormPermissions = superiorIds.map(({ id }) => ({
    userId: id,
    formId: formId,
}));

console.log(userFormPermissions)