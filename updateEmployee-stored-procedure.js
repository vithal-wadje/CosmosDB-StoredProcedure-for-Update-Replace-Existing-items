function updateEmployee(department, id, updatedName, updatedCountry, updatedCity, updatedDesignation) {
    var context = getContext();
    var container = context.getCollection();
    var response = context.getResponse();

    if (!id || !department) {
        throw new Error("Please provide both the employee's ID and Department (Partition Key) you wish to update.");
    }

    var filterQuery = {
        'query': 'SELECT * FROM Employees e WHERE e.id = @id AND e.Department = @department',
        'parameters': [
            { 'name': '@id', 'value': id },
            { 'name': '@department', 'value': department }
        ]
    };

    container.queryDocuments(container.getSelfLink(), filterQuery, {}, function(err, items) {
        if (err) {
            throw new Error("Error querying the document: " + err.message);
        } else if (items.length === 0) {
            response.setBody('No employee found with the given ID and Department.');
        } else {
            var employeeDocument = items[0];
            employeeDocument.Name = updatedName || employeeDocument.Name;
            employeeDocument.Country = updatedCountry || employeeDocument.Country;
            employeeDocument.City = updatedCity || employeeDocument.City;
            employeeDocument.Designation = updatedDesignation || employeeDocument.Designation;

            container.replaceDocument(employeeDocument._self, employeeDocument, function(err, result) {
                if (err) {
                    throw new Error("Error updating the document: " + err.message);
                } else {
                    response.setBody('Successfully updated the employee details for ID: ' + id + ' in Department: ' + department);
                }
            });
        }
    });
}
