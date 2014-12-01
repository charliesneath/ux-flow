
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
    flow.set('sequences', '');
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

        var sequenceToSave = [];
        var moments = $(sequences[i]).find('.moment');

        for (j = 0; j < moments.length; j++) {
            // A collection of blocks.
            var momentsToSave = [];
            // The block in this moment
            var blocks = $(moments[j]).find('.block'); 
            
            // Cycle through the blocks in this moment.
            for (k = 0; k < blocks.length; k++) {
                var curBlock = {};
                curBlock['content'] = $(blocks[k]).find('textarea').val();
                
                if ($(blocks[k]).data('height')) {
                    curBlock['height'] = $(blocks[k]).data('height');
                } else {
                    curBlock['height'] = '2';
                }
                                // Add this block to this moment
                momentsToSave.push(curBlock);
            }

            // Add this list of moments to the sequence
            sequenceToSave[j] = momentsToSave;
        };
        
        // Save this sequence to the flow.
        flowToSave[i] = sequenceToSave;
    }

    var Flow = Parse.Object.extend("Flow");
    var flow = new Flow();
    var query = new Parse.Query(Flow);
    var flowId = $('#flow').data('flowId');

    query.get(flowId, {
        success: function(flow) {
            flow.set("email",  email);
            flow.set("sequences", JSON.stringify(flowToSave));
            flow.set("name", name);
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
    // Set name of new flow
    $('#flow-name').text(data.get('name'));

    // Reset current flow.
    $('#flow').empty();
    $('#flow').append(newAddSequence);
            
    // Check if flow exists.
    if (data.get('sequences') !== '') {
        // Convert the flow from plain text.
        var sequencesToBuild = JSON.parse(data.get('sequences'));

        // Add sequences to the page
        var numSequences = Object.keys(sequencesToBuild).length;
        for (var i = 0; i < numSequences; i++) {
            $('#flow').append(newSequence);
        }
        // Create object of all sequences added to the page.
        var sequences = $('.sequence');

        // Add moments to each sequence.
        $.each(sequencesToBuild, function(sequenceKey, momentsToBuild) {
            // How many moments in this sequence?
            var numMoments = Object.keys(momentsToBuild).length;
            for (var j = 0; j < numMoments; j++) {
                if (j == 0) {
                    $(sequences[sequenceKey]).append(newAddMoment);
                }
                // Use the sequences on the page along with sequenceKey variable to append moment.
                $(sequences[sequenceKey]).append(newMoment);
            }

            // Create object of moments in the current sequence.
            var moments = $(sequences[sequenceKey]).find('.moment');

            // Add blocks to the current moment on the page.
            $.each(momentsToBuild, function(momentKey, blocksToBuild) {
                var numBlocks = Object.keys(blocksToBuild).length;

                $(moments[momentKey]).append(newAddBlock);
                for (var k = 0; k < numBlocks; k++) {
                    $(moments[momentKey]).append(newBlock);
                    $(moments[momentKey]).append(newAddBlock);
                }

                // Create object of each block in the current moment.
                var blocks = $(moments[momentKey]).find('.block');

                // Modify the blocks that have already been added to the page.
                $.each(blocksToBuild, function(blockKey, block) {
                    // Block height is in units that are multiplied by the global increment.
                    // Size of new block element has to be included as well.
                    var newBlockButtonHeight = 20;
                    var heightUnits = parseInt(block['height']);
                    var newHeight = (blockSizeIncrement * heightUnits) + (newBlockButtonHeight * (heightUnits - 1));
                    
                    $(blocks[blockKey]).height(newHeight);
                    $(blocks[blockKey]).data('height', heightUnits);
                    $(blocks[blockKey]).find('textarea').val(block['content']);
                })
            })
        });
    } else {
        alert('empty flow');

        // If this is a new flow with no content, create a new one.
        $('#flow').empty();
        //$('#sequences').append(newAddSequence);
        $('#flow').append(newSequence);
        $('#flow .sequence:last-child').html(newAddMoment + newMoment + newAddMoment);
        var moment = $('.moment');
        $(moment[0]).html(newAddBlock + newBlock + newAddBlock);
        //$('#sequences').append(newAddSequence); not yet!
    }

    // Show the flow.
    $('.view#app').show();
}