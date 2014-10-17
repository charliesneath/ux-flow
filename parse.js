Parse.initialize("xZLK60kGbq8rWmuqZgcQlC1U2JVS4LbCOo5nmOlR", "ScYAIu0yZ8qUiACyNZXd2hwd5SB0HAMElc0Mlgqt");

function loadFlowMenu() {
    window.location.hash = 'menu';
    $('.view#app').fadeOut(100);

    var Flow = Parse.Object.extend("Flow");
    var query = new Parse.Query(Flow);
    var email = $('#email').text();

    query.equalTo("email", email);
    query.find({
        success: function(data) {
            $('#flow-menu').empty();
            for (i = 0; i < data.length; i++) {
               $('#flow-menu').append('<li></li>');
                $('#flow-menu li:last-child').html(data[i].get('name') + '<a class="delete-flow"></a>');
                $('#flow-menu li:last-child').data('flowId', data[i].id);
            }
            $('.view#menu').fadeIn(100);
        }
    })
}

function saveNewFlow(newFlowName) {
    $('.view#menu').fadeOut(100);
    var Flow = Parse.Object.extend("Flow");
    var flow = new Flow();
    var email = $('#email').text();

    flow.set('email', email);
    flow.set('name', newFlowName);
    flow.set('flow', '');
    flow.save(null, {
        success: function(data) {
            $('#flow-menu').append('<li></li>');
            $('#flow-menu li:last-child').text(newFlowName);
            $('#flow').data('flowId', data.id);
            $('#flow-name').text(newFlowName);
            window.location.hash = 'app';
        }
    })
}

function saveFlow() {
    var flowToSave = {};
    var sequences = $('.sequence');
    var email = $('#email').text();
    var name = $('#flow-name').text();

    // Cycle through each sequence and save the moment information for each.
    for (i = 0; i < sequences.length; i++) {
        var sequence = [];
        var moments = $(sequences[i]).find('.moment textarea');
        for (j = 0; j < moments.length; j++) {
            sequence.push($(moments[j]).val());
        }
        flowToSave[i] = sequence;
    }

    var Flow = Parse.Object.extend("Flow");
    var flow = new Flow();
    var query = new Parse.Query(Flow);
    var flowId = $('#flow').data('flowId');

    query.get(flowId, {
        success: function(flow) {
            // Execute any logic that should take place after the object is saved.
            flow.set( "email",  email);
            flow.set( "flow", JSON.stringify(flowToSave));
            flow.set( "name", name);
            flow.save();
        },
        error: function(flows, error) {
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
}

function loadFlow() {
    window.location.hash = 'app';

    var flowId = $('#flow').data('flowId');
    var Flow = Parse.Object.extend("Flow");
    var query = new Parse.Query(Flow);

    query.get(flowId, {
        success: function(data) {
            $('.view#menu').fadeOut(100);

            // Check if flow exists.
            if (data.get('flow') !== '') {
                var flow = JSON.parse(data.get('flow'));

                // Reset current flow.
                $('#title h2').text(data.get('name'));
                $('#flow').empty();
                // If there was flow information.
                $('#flow').append(newAddSequence);
                for (sequence in flow) { 
                    if (flow.hasOwnProperty(sequence)) {
                        $('#flow').append(newSequence);
                        
                        $('#flow .sequence:last-child').append(newAddMoment);
                        var moment = flow[sequence];
                        for (i=0; i < moment.length; i++) {
                            $('#flow .sequence:last-child').append(newMoment);
                            $('#flow .sequence:last-child .moment:last-child textarea').val(moment[i]);
                            if (moment[i] !== '') {
                                $('#flow .sequence:last-child .moment:last-child textarea').removeClass('empty');
                            }
                            $('#flow .sequence:last-child').append(newAddMoment);
                        }
                        $('#flow').append(newAddSequence);
                    }
                }
            } else {
                // If this is a new flow with no content, create a new one.
                $('#flow').empty();
                $('#flow').append(newAddSequence);
                $('#flow').append(newSequence);
                $('#flow .sequence:last-child').html(newAddMoment + newMoment + newAddMoment);
                $('#flow').append(newAddSequence);
            }

            // Show the flow.
            $('.view#app').fadeIn(100);
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    })
}