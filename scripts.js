var newMoment = '<div class="moment new" draggable="true"><textarea placeholder="new moment" draggable=true></textarea></div>';
var newAddMoment = '<div class="add-moment">+</div>';
var dragSrcEl = null;

$(function() {
  $(document.body).on('click', '.add-moment', function() {
    if ($(this).prev().length > 0) {
      $(this).after(newAddMoment).after(newMoment);
     } else {
       $('#moments').prepend(newMoment).prepend(newAddMoment);
     }
  });

  $(document.body).on('dragstart', '.moment textarea', function(e) {

      $(this).removeClass('dragenter');

      dragSrcEl = this;
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
    if (dragSrcEl != this && this.value != '') {

      // Set the source column's HTML to the HTML of the column we dropped on.
      dragSrcEl.value = this.value;
      this.value = e.originalEvent.dataTransfer.getData('text/plain');
    }

    if ($(dragSrcEl).hasClass('new') && !$(this).hasClass('new')) {
      $(this).addClass('new');
      $(dragSrcEl).removeClass('new');
    }

     if ($(this).hasClass('new') && !$(dragSrcEl).hasClass('new')) {
      $(this).removeClass('new');
      $(dragSrcEl).addClass('new');
    }

    e.originalEvent.stopPropagation();

  })
})