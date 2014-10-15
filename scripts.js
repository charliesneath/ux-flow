var newMoment = '<div class="moment new" draggable="true"><textarea placeholder="new moment" draggable=true></textarea></div>';
var newAddMoment = '<div class="add-moment"></div>';
var draggedElement = null;
var elementToDelete = null;

$(function() {
    loadFlow();

    $('#title #back').click(function() {
        saveFlow();
    })

  $(document.body).on('click', '.add-moment', function() {
    if ($(this).prev().length > 0) {
      $(this).after(newAddMoment).after(newMoment);
     } else {
       $('#moments').prepend(newMoment).prepend(newAddMoment);
     }
     saveFlow();
  });

  $(document.body).on('focus', '.moment', function() {
    $(this).removeClass('new');
  })

  $(document.body).on('blur', '.moment', function() {
      if ($(this).find('textarea').val() == '') {
        $(this).addClass('new');
      }
      saveFlow();
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
    $(this).removeClass('dragenter');


    // Don't do anything if dropping the same column we're dragging.
    if (draggedElement != this && this.value != '') {
      // Set the source column's HTML to the HTML of the column we dropped on.
      draggedElement.value = this.value;
      this.value = e.originalEvent.dataTransfer.getData('text/plain');
    } else if (this.value == '') {
      draggedElement.value = '';
      this.value = e.originalEvent.dataTransfer.getData('text/plain');      
    }

    if ($(draggedElement).hasClass('new') && !$(this).hasClass('new')) {
      $(this).addClass('new');
      $(draggedElement).removeClass('new');
    }

     if ($(this).hasClass('new') && !$(draggedElement).hasClass('new')) {
      $(this).removeClass('new');
      $(draggedElement).addClass('new');
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
  var moments = $('.moment');
  for (i = 0; i < moments.length; i++) {
    flow.push($(moments[i]).find('textarea').val());
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

  $('#moments').append('<div class="add-moment">+</div>');

  for (i = 0; i < data.length; i++) {
    flow.push(data[i]);
    $('#moments').append('<div class="moment" draggable="true"><textarea placeholder="new moment" draggable=true>' + flow[i] + '</textarea></div>');
    $('#moments').append('<div class="add-moment">+</div>');
  }
}