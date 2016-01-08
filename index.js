var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://company.clearbit.com/'
});

var pickInputs = {
    'id': { key: 'id', validate: { req: true }},
    'name': 'name',
    'tags': 'tags',
    'description': 'description',
    'raised': 'raised',
    'location': 'location',
    'logo': 'logo',
    'linkedin_handle': 'linkedin_handle'
};

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            apiKey = dexter.environment('clearbit_api_key');

        if (!apiKey)
            return this.fail('A [clearbit_api_key] environment variable is required for this module');

        if (validateErrors)
            return this.fail(validateErrors);

        request.post({
            uri: '/v1/companies/' + inputs.id + '/flag',
            qs: inputs,
            auth: { user: apiKey, pass: '' },
            json: true
        }, function (error, response, body) {
            if (error)
                this.fail(error);
            else if (body && body.error)
                this.fail(body.error);
            else
                this.complete({ success: true });
        }.bind(this));
    }
};
