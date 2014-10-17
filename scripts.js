var newMoment = '<div class="moment" draggable="true"><div class="delete-moment">&times;</div><textarea class="empty" draggable=true></textarea></div>';
// var newMoment = '<div class="moment new" draggable="true"></div>';
var newAddMoment = '<div class="add-moment"></div>';
var newSequence = '<div class="sequence" draggable="true"></div>'
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

    // $(document.body).on('hover', '#flow-menu li', function() {
    //     $(this).find('.delete-flow').toggle();
    // })

    // $(document.body).on('click', '.delete-flow', function() {
    //     var deleteFlow = confirm('Delete flow "' + $(this).parent('li').text() + '" ?');
    //     if (deleteFlow !== null) {
    //         deleteFlow();
    //     }
    // })

    $(document.body).on('click', '#flow-menu li', function() {
        flowId = $(this).data('flowId');
        $('#flow').data('flowId', flowId);
        $('.view#menu').hide();
        loadFlow();
    })

    $('#back-to-menu').click(function() {
        window.location.hash = 'menu';
    })

    $(document.body).on('hover', '.moment', function() {
      $(this).find('.delete-moment').toggle();
       saveFlow();
    });


    $(document.body).on('click', '.add-moment', function() {
      if ($(this).index == 0) {
        $('.sequence').prepend(newMoment).prepend(newAddMoment);
       } else {
         $(this).after(newAddMoment).after(newMoment);
       }
       saveFlow();
    });

    $(document.body).on('click', '.delete-moment', function() {
        if ($(this).parents('.sequence').find('.moment').length > 1) {
            // Remove add moment.
            $(this).parents('.moment').prev().remove();
            $(this).parents('.moment').remove();
        } else {
            $(this).parents('.sequence').next().remove();
            $(this).parents('.sequence').remove();
        }
        saveFlow();
    })
    
    $(document.body).on('click', '.add-sequence', function() {
        addNewSequence($(this).index());
    })

    $(document.body).on('focus', 'textarea.empty', function() {
        $(this).removeClass('empty');
    })

    $(document.body).on('blur', 'textarea', function() {
        if ($(this).val() == '') {
          $(this).addClass('empty');
        }
        saveFlow();
    })

    // MOMENT DRAG

    $(document.body).on('dragstart', '.moment textarea', function(e) {

        $(this).removeClass('dragenter');

        draggedElement = this;
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/plain', this.value);
    })

    $(document.body).on('dragleave', '.moment textarea', function(e) {
        $(this).removeClass('dragenter');
    })

    $(document.body).on('dragenter', '.moment textarea', function(e) {
        $(this).addClass('dragenter');
        // Necessary to allow for a drop
        e.originalEvent.preventDefault();
    })

    $(document.body).on('dragover', '.moment textarea', function(e) {
        // Necessary to allow for a drop
        e.originalEvent.preventDefault();
    })  

    $(document.body).on('dragend', '.moment textarea', function(e) {
        // Necessary to allow for a drop
        $(this).removeClass('dragenter');
    })  

    $(document.body).on('drop', '.moment textarea', function(e) {
        var dropLocation = this;

        $(dropLocation).removeClass('dragenter');

        // Don't do anything if dropping the same column we're dragging.
        if (draggedElement != dropLocation && dropLocation.value != '') {
          // Set the source column's HTML to the HTML of the column we dropped on.
          draggedElement.value = dropLocation.value;
          this.value = e.originalEvent.dataTransfer.getData('text/plain');
        } else if (dropLocation.value == '') {
          draggedElement.value = '';
          dropLocation.value = e.originalEvent.dataTransfer.getData('text/plain');      
        }

        if ($(draggedElement).hasClass('empty') && !$(dropLocation).hasClass('empty')) {
          $(dropLocation).addClass('empty');
          $(draggedElement).removeClass('empty');
        }

         if ($(dropLocation).hasClass('empty') && !$(draggedElement).hasClass('empty')) {
          $(dropLocation).removeClass('empty');
          $(draggedElement).addClass('empty');
        }

        e.originalEvent.stopPropagation();
        saveFlow();
    })

    // MOVE SEQUENCE

    // $(document.body).on('dragstart', '.sequence', function(e) {
    //     $(this).removeClass('dragenter');
    //     draggedSequence = this;
    //     e.originalEvent.dataTransfer.effectAllowed = 'move';
    // })

    // DELETE MOMENT

    $(document.body).on('dragenter', '#delete-moment', function(e) {
        // Necessary to allow for a drop
        $(this).addClass('delete-enter');
        e.originalEvent.preventDefault();
    })

    $(document.body).on('dragleave', '#delete-moment', function(e) {
        $(this).removeClass('delete-enter');
    })

    $(document.body).on('dragend', '#delete-moment', function(e) {
        // Necessary to allow for a drop
        $(this).removeClass('delete-enter');
    })
    
    $(document.body).on('dragover', '#delete-moment', function(e) {
        // Necessary to allow for a drop
        e.originalEvent.preventDefault();
    })  

    $(document.body).on('drop', '#delete-moment', function(e) {
        // if ($(draggedSequence !== null)) {
        //     // Make sure this isn't the last sequence on the page.
        //     if ($('.sequence').length > 1 ) {
        //         $(draggedSequence).prev('.add-sequence').remove();
        //         $(draggedSequence).remove();
        //     }

        //     // Reset dragged sequence.
        //     draggedSequence = null;
        // } else {
            $(draggedElement).parents('.moment').next('.add-moment').remove();
            $(draggedElement).parents('.moment').remove();
            draggedElement = null;
        // }

        $(this).removeClass('delete-enter');
        e.originalEvent.stopPropagation();
        saveFlow();
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