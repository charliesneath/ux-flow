var newMoment = '<div class="moment empty" draggable="true"><div class="delete-moment">&times;</div><div class="highlight-moment">&#9679;</div><textarea draggable=true></textarea></div>';
var newAddMoment = '<div class="add-moment"></div>';
var newSequence = '<div class="sequence" draggable="true"><div class="delete-sequence">&times;</div></div>'
var newAddSequence = '<div class="add-sequence"></div>'
var draggedElement = null;
var draggedSequence = null;
var elementToDelete = null;

$(function() {
    loadFlowMenu();

    $('#email').click(function() {
        saveFlow();
    })

    $('#flow-name').click(function() {
        var newFlowName = prompt('Name of flow:');
        if (newFlowName !== '' && newFlowName !== null) {
            $('#flow-name').text(newFlowName);
            saveFlow();
        }
    })

    $('#new-flow').click(function() {
        var newFlowName = prompt('New flow name');
        if (newFlowName !== '' && newFlowName !== null) {
            saveNewFlow(newFlowName);
        }
    })

    $(document.body).on('click', '#flow-menu li', function() {
        window.location.hash = 'app';
        flowId = $(this).data('flowId');
        $('#flow').data('flowId', flowId);
    })

    $('#back-to-menu').click(function() {
        window.location.hash = 'menu';
    })

    $(document.body).on('hover', '.moment', function() {
      $(this).find('.delete-moment').toggle();
      $(this).find('.highlight-moment').toggle();
    });

    $(document.body).on('click', '.add-moment', function() {
      if ($(this).index == 0) {
        $('.sequence').prepend(newMoment).prepend(newAddMoment);
       } else {
         $(this).after(newAddMoment).after(newMoment);
       }
       saveFlow();
    });

    $(document.body).on('click', '.add-sequence', function() {
        addNewSequence($(this).index());
    })

    $(document.body).on('click', '.delete-sequence', function() {
        if ($('.sequence').length > 1) {
            $(this).parents('.sequence').next().remove();
            $(this).parents('.sequence').remove();
            saveFlow();
        }
    })

    $(document.body).on('focus', 'textarea.empty', function() {
        $(this).removeClass('empty');
    })

    $(document.body).on('click', '.moment', function(e) {
        if ($(e.target).hasClass('highlight-moment')) {
            $(this).toggleClass('highlight');
        } else if ($(e.target).hasClass('delete-moment')) {
            if ($(this).parents('.sequence').find('.moment').length > 1) {
                // Remove add moment.
                $(this).prev().remove();
                $(this).remove();
            }
        } else {
            $(this).find('p').hide();
            $(this).find('textarea').show();
            $(this).find('textarea').focus();
            $(this).addClass('focus');
        }
        saveFlow();
    })

    $(document.body).on('blur', 'textarea', function() {
        if ($(this).val() == '') {
          $(this).parents('.moment').addClass('empty');
        } else {
            $(this).parents('.moment').removeClass('empty');
            highlightText($(this).parents('.moment'));
        }

        $(this).parents('.moment').removeClass('focus');
        saveFlow();
    })

    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            $(':focus').blur();
        }
    });

    // MOMENT DRAG

    $(document.body).on('dragstart', '.moment', function(e) {
        $(this).removeClass('dragenter');

        // draggedElement is global variable
        draggedElement = this;
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/plain', $(draggedElement).children('textarea').val());
    })

    $(document.body).on('dragleave', '.moment', function(e) {
        $(this).removeClass('dragenter');
    })

    $(document.body).on('dragenter', '.moment', function(e) {
        $(this).addClass('dragenter');
        // Necessary to allow for a drop
        e.originalEvent.preventDefault();
    })

    $(document.body).on('dragover', '.moment', function(e) {
        // Necessary to allow for a drop
        e.originalEvent.preventDefault();
    })

    $(document.body).on('dragend', '.moment', function(e) {
        // Necessary to allow for a drop
        $(this).removeClass('dragenter');
    })

    $(document.body).on('drop', '.moment', function(e) {
        var dropLocation = this;
        var draggedContent = $(draggedElement).children('textarea');
        var dropContent = $(dropLocation).children('textarea');

        $(dropLocation).removeClass('dragenter');

        // Change the content in the dragged and dropped moments.
        // Don't do anything if dropping the same column we're dragging.
        if (draggedElement != dropLocation && $(dropContent).val() != '') {
            // Set the source column's HTML to the HTML of the column we dropped on.
            $(draggedContent).val( $(dropContent).val() );
            $(dropContent).val( e.originalEvent.dataTransfer.getData('text/plain') );

        } else if ($(dropLocation).val() == '') {
            // Dop location is empty.
            $(draggedContent).val('');
            $(dropContent).val( e.originalEvent.dataTransfer.getData('text/plain') );
        }
        
        if ($(draggedElement).hasClass('empty') && !$(dropLocation).hasClass('empty')) {
            $(dropLocation).addClass('empty');
            $(draggedElement).removeClass('empty');
        } else if ($(dropLocation).hasClass('empty') && !$(draggedElement).hasClass('empty')) {
            $(draggedElement).addClass('empty');
            $(dropLocation).removeClass('empty');
        }

        highlightText(draggedElement);
        highlightText(dropLocation);
        saveFlow();

        e.originalEvent.stopPropagation();
    })
})

function addNewSequence(clickIndex) {
    var flow = $('#flow').children();

    // Handle initial case.
    if (clickIndex > 0) {
        $(flow[clickIndex]).after(newSequence);
        // Update flow.
        flow = $('#flow').children();
        var moments = $(flow[clickIndex - 1]).find('.moment');
        $(flow[clickIndex + 1]).append(newAddMoment);
        for (i = 0; i < moments.length; i++) {
            $(flow[clickIndex + 1]).append(newMoment);
            $(flow[clickIndex + 1]).append(newAddMoment);
        }
        $(flow[clickIndex + 1]).after(newAddSequence);
    } else {
        // Get length of next sequence.
        var moments = $(flow[1]).find('.moment');
        // Add the new sequence.
        $('#flow').prepend(newSequence);
        var sequences = $('#flow .sequence');
        $(sequences[0]).append(newAddMoment);
        for (i = 0; i < moments.length; i++) {
            $(sequences[0]).append(newMoment);
            $(sequences[0]).append(newAddMoment);
        }
        $('#flow').prepend(newAddSequence);
    }
}

window.onhashchange = locationHashChanged;

function locationHashChanged() {
  if (location.hash === "#menu") {
        loadFlowMenu();
    } else if (location.hash === "#app") {
        loadFlow();
    }
}

function highlightText(moment) {
    var textarea = $(moment).children('textarea');
    var newLineRegex = /^.*$/gm;
    var questionRegex = /^.*\?$/gm;
    var content = $(textarea).val().match(newLineRegex);

    // Reset the content in the div.
    $(moment).find('p').remove();

    // Find all of the content in the textarea.
    if (content.length > 0) {
        $(content).each(function(index) {


            var isQuestion = questionRegex.test(this);
            if (index == 0) {
                // Bold and capitalize the first line in a moment.
                $(moment).append('<p><strong>' + this.toUpperCase() + '</strong></p>');
            } else if (this.indexOf('>') == 0) {
                $(moment).append('<p><span class="highlight-action">' + this + '</span></p>');
            } else if (this != '' &&  isQuestion == true) {
                $(moment).append('<p><span class="highlight-question">' + this + '</span></p>');
            } else {
                $(moment).append('<p>' + this + '</p>');
            }
        })
    }

    // Hide the editable content.
    $(textarea).hide();
}

function animateIn() {
    $(this).animate({opacity: 1}, 1000);
}

function animateOut() {
    $(this).animate({opacity: 0}, 1000);
}
