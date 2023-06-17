export const requirementsEditor = {
  placeholder: 'Type Position Requirements here!',
  fontFamily: {
    options: [
      'default',
      'Ubuntu, Arial, sans-serif',
      'Ubuntu Mono, Courier New, Courier, monospace'
    ]
  }, fontColor: {
    colors: [
      {
        color: 'hsl(0, 0%, 0%)',
        label: 'Black'
      },
      {
        color: 'hsl(0, 0%, 30%)',
        label: 'Dim grey'
      },
      {
        color: 'hsl(0, 0%, 60%)',
        label: 'Grey'
      },
      {
        color: 'hsl(0, 0%, 90%)',
        label: 'Light grey'
      },
      {
        color: 'hsl(0, 0%, 100%)',
        label: 'White',
        hasBorder: true
      },

      // ...
    ]
  },
  
  language: 'en',
  fontBackgroundColor: {
    colors: [
      {
        color: 'hsl(0, 75%, 60%)',
        label: 'Red'
      },
      {
        color: 'hsl(30, 75%, 60%)',
        label: 'Orange'
      },
      {
        color: 'hsl(60, 75%, 60%)',
        label: 'Yellow'
      },
      {
        color: 'hsl(90, 75%, 60%)',
        label: 'Light green'
      },
      {
        color: 'hsl(120, 75%, 60%)',
        label: 'Green'
      },

      // ...
    ]
  },
  alignment: {
    options: ['left', 'right']
  },
  toolbar: {
    items: [
      'fontColor',
      'fontBackgroundColor',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'specialCharacters',
      'strikethrough',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'highlight',
      'horizontalLine',
      '|',
      'alignment',
      'indent',
      'outdent',
      '|',
      'blockQuote',
      'removeFormat',
      '|',
      'undo',
      'redo'
    ]
  },
}
