var newMoment = '<div class="moment" draggable="true"><textarea class="empty" draggable=true></textarea></div>';
// var newMoment = '<div class="moment new" draggable="true"></div>';
var newAddMoment = '<div class="add-moment"></div>';
var newSequence = '<div class="sequence"></div>'
var newAddSequence = '<div class="add-sequence"></div>'
var draggedElement = null;
var elementToDelete = null;

$(function() {
    //loadFlow();

    $('#title').click(function() {
        var title = prompt('Name of flow:');
        $('#title h2').text(title);
    })

  $(document.body).on('click', '.add-moment', function() {
    if ($(this).index == 0) {
      $('.sequence').prepend(newMoment).prepend(newAddMoment);
     } else {
       $(this).after(newAddMoment).after(newMoment);
     }
     // saveFlow();
  });

  $(document.body).on('click', '.add-sequence', function() {
    // Add new sequence;
    $(this).after(newSequence);

    var clickedAddSequence = this;
    var previousSequence = $(this).prev();
    var sequence = $(this).next();
    var moments = $(previousSequence).find('.moment');
    
    $(sequence).append(newAddMoment);
    for (i = 0; i < moments.length; i++) {
      $(sequence).append(newMoment);
      $(sequence).append(newAddMoment);
    }

    $(sequence).after(newAddSequence);
  })

  $(document.body).on('focus', 'textarea.empty', function() {
    $(this).removeClass('empty');
  })

  $(document.body).on('blur', 'textarea', function() {
      if ($(this).val() == '') {
        $(this).addClass('empty');
      }
      //saveFlow();
  })

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
      $(draggedElement).parents('.moment').next('.add-moment').remove();
      $(draggedElement).parents('.moment').remove();
      $(this).removeClass('delete-enter');
      e.originalEvent.stopPropagation();
      saveFlow();
  })
})

function saveFlow() {
  var flow = new Array();
  var sequence = $('.moment');
  for (i = 0; i < sequence.length; i++) {
    flow.push($(sequence[i]).find('textarea').val());
  }

  localStorage.setItem('ux-flow', JSON.stringify(flow));
  console.log(JSON.parse(localStorage.getItem('ux-flow')));
}

function loadFlow() {
  var flow = new Array;

  if (localStorage && localStorage.getItem('ux-flow')) {
    var data = localStorage.getItem('ux-flow')
    data = JSON.parse(data);
  }

  $('.sequence').append('<div class="add-moment"></div>');

  for (i = 0; i < data.length; i++) {
    flow.push(data[i]);
    $('.sequence').append('<div class="moment" draggable="true"><textarea placeholder="new moment" draggable=true>' + flow[i] + '</textarea></div>');
    $('.sequence').append('<div class="add-moment"></div>');
  }
}

function addSequence(previousSequence) {
  var sequence = newSequence;
  var moments = $(previousSequence).find('.moment');

  // Add initial "add new moment button"
  $(sequence).text(newAddMoment);
  alert(sequence);

  // Add the rest of the elements to the sequence.
  for (i = 0; i < moments.length; i++) {
    $(newMoment).appendTo();
    $(sequence).append(newAddMoment);
    alert(sequence);
  }

  $(previousSequence).after(sequence).html();
}