var newMoment = '<div class="moment new" draggable="true">new moment</div>';
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

  $(document.body).on('click', '.moment', function() {
    var momentContent = prompt('what is this moment?');
    momentContent = momentContent.trim();
    if (momentContent !== '') {
      $(this).removeClass('new');
      this.innerHTML = momentContent;
    }
  })

  $(document.body).on('dragstart', '.moment', function(e) {
      $(this).removeClass('dragenter');

      dragSrcEl = this;
      e.originalEvent.dataTransfer.effectAllowed = 'move';
      e.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
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
    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
      // Set the source column's HTML to the HTML of the column we dropped on.
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.originalEvent.dataTransfer.getData('text/html');
    }

    $(this).removeClass('dragenter');

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