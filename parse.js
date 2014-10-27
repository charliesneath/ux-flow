function loadFlowMenu() {
    window.location.hash = 'menu';
    $('.view#app').hide();

    var Flow = Parse.Object.extend("Flow");
    var query = new Parse.Query(Flow);
    var email = $('#email').text();

    // Find all flows associated with the current username.
    query.equalTo("email", email);
    query.find({
        success: function(data) {
            // Clear the flow.
            $('#flow-menu').empty();
            
            // Add all of the flows to the list.
            for (i = 0; i < data.length; i++) {
               $('#flow-menu').append('<li></li>');
                $('#flow-menu li:last-child').html(data[i].get('name') + '<a class="delete-flow"></a>');
                $('#flow-menu li:last-child').data('flowId', data[i].id);
            }
            $('.view#menu').show();
        },
        error: function(error) {
            console.log('No connection to server, trying to load from local storage');
        }
    })
}

function saveNewFlow(newFlowName) {
    $('.view#menu').hide();
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
        },
        error: function(error) {
            console.log('Error saving new flow');
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
        var moments = $(sequences[i]).find('.moment');
        for (j = 0; j < moments.length; j++) {

            sequence.push({
                'content': $(moments[j]).find('textarea').val(),
                'isHighlighted': $(moments[j]).hasClass('highlight')
            })
        };
        
        // Save this sequence to the flow.
        flowToSave[i] = sequence;
    }

    var Flow = Parse.Object.extend("Flow");
    var flow = new Flow();
    var query = new Parse.Query(Flow);
    var flowId = $('#flow').data('flowId');

    query.get(flowId, {
        success: function(flow) {
            flow.set( "email",  email);
            flow.set( "flow", JSON.stringify(flowToSave));
            flow.set( "name", name);
            flow.save();
        },
        error: function(flow, error) {
            console.log('Error saving flow');
        }
    });
}

function loadFlow() {
    // Hide the menu.
    $('.view#menu').hide();

    // Get the current saved flow id.
    var flowId = $('#flow').data('flowId');
    var Flow = Parse.Object.extend("Flow");
    var query = new Parse.Query(Flow);

    query.get(flowId, {
        success: function(data) {
            displayFlow(data);
        },
        error: function(error) {
            // If error, try loading from local repository;
            console.log('Error loading new flow');
        }
    })
}

function displayFlow(data) {
    // Check if flow exists.
    if (data.get('flow') !== '') {
        // Convert the flow from plain text.
        var flow = JSON.parse(data.get('flow'));

        // Reset current flow.
        $('#title h2').text(data.get('name'));
        $('#flow').empty();
        
        $('#flow').append(newAddSequence);
        
        // Cycle through each of the sequences in the flow.
        for (sequence in flow) { 
            if (flow.hasOwnProperty(sequence)) {
                $('#flow').append(newSequence);

                // Newest sequence = the last child of the flow.
                var curSequence = $('#flow .sequence:last-child');
                
                // Create a new moment in this flow.
                $(curSequence).append(newAddMoment);
                var moments = flow[sequence];
                
                $(moments).each(function() {
                    
                    $(curSequence).append(newMoment);
                    var curMoment = $('#flow .sequence:last-child .moment:last-child');
                    
                    // Fill this moment's text area with the saved content.
                    $(curMoment).children('textarea').val(this['content']);

                    // Highlight the moment if necessary.
                    if (this['isHighlighted'] == true) {
                        $(curMoment).addClass('highlight');
                    }

                    // Highlight the content.
                    if (this['content'] !== '') {
                        $(curMoment).removeClass('empty');
                    }

                    // Highlight the text.
                    highlightText(curMoment);
                    
                    // Add another end to the sequence.
                    $(curSequence).append(newAddMoment);
                })
                
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
    $('.view#app').show();
}