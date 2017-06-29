/**
* @customElement
* @polymer
*/
class ZeppelinViewer extends Polymer.mixinBehaviors([ZEPPELIN_BEHAVIORS],ZeppelinReduxMixin(Polymer.Element)) {
  static get is() { return 'zeppelin-viewer' }
  static get properties() {
    return {
      socketUrl: {
        type: String
      },
      wsData: {
        type: Object,
        statePath:'ws.post'
      },
      authObj:{
        type:Object,
        statePath:'ws.auth'
      },
      view:{
        type:String,
        statePath:'view'
      }
    };
  }
  static get observers(){
    return ['sendData(wsData)','authChange(authObj)']
  }
  add(){
    this.dispatch({
      type:'UPDATE_VIEW',
      payload: new Date()
    })
  }
  handleResponse(response) {
    this.dispatch({type:'SET_AUTH',payload:response.detail.response.body})
  }
  authChange() {
    this.$.socket.open();
  }
  _onOpen() {
    this.pingSocket();
    this.set('socketEnable', true);
    this.getNoteList();
    this.set('connected', true);
  }
  getNoteList() {
    var postObj = {
      op: 'LIST_NOTES'
    };
    this.dispatch({type:'WS_POST',payload:postObj})
  }
  pingSocket() {
    // for polling the server
    setInterval(function() {
      var dummyObj = {
        op: 'PING'
      };
      this.set('wsData', dummyObj);
    }.bind(this), 45000);
  }
  sendData(message) {
    let constructMessage = Object.assign(message, this.authObj);
    this.$.socket.send(constructMessage);
  }
  _onClose() {
    if (this.connected) {
      this.$.socket.open();
    }
  }
  _onError() {
    this.$.socket.close();
    this.set('connected', false);
  }
  handleSocketResponse(response) {
    var op = response.detail.op;
    var data = response.detail.data;
    this.dispatch({type:op,payload:data});
    // switch (op) {
    //   case 'NOTE':
    //   this.dispatch({type:'NOTE',payload:data.note});
    //   // this.set('noteObj.notebook', data.note);
    //   break;
    //   case 'NEW_NOTE':
    //   this.set('notebook', data.note);
    //   this.set('notebookId', data.note.id);
    //   // this.set('viewMode', false);
    //   break;
    //   case 'NOTES_INFO':
    //   this.dispatch({type:'ADD_NOTES',payload:data.notes});
    //   // this.set('noteObj.notebooks', data.notes);
    //   break;
    //   case 'GET_NOTE':
    //   debugger;
    //   this.dispatch({type:'GET_NOTE',payload:data.id});
    //   // this.set('noteObj', data.id);
    //   break;
    //   case 'PROGRESS':
    //   this.set('noteObj.notebook.paragraphs.' + this.getObjectIndex(data.id) + '.status', 'PROGRESS');
    //   this.notifyPath('noteObj.notebook.paragraphs');
    //   break;
    //   case 'PARAGRAPH_APPEND_OUTPUT':
    //   this.set('noteObj.notebook.paragraphs.' + this.getObjectIndex(data.paragraphId) + '.progress', data);
    //   break;
    //   case 'PARAGRAPH':
    //   this.set('noteObj.notebook.paragraphs.' + this.getObjectIndex(data.paragraph.id), data.paragraph);
    //   break;
    //   case 'PARAGRAPH_MOVED':
    //   var getObj = this.splice('noteObj.notebook.paragraphs', this.getObjectIndex(data.id), 1);
    //   this.splice('noteObj.notebook.paragraphs', data.index, 0, getObj[0]);
    //   break;
    //   case 'PARAGRAPH_REMOVED':
    //   this.splice('noteObj.notebook.paragraphs', this.getObjectIndex(data.id), 1);
    //   break;
    //   case 'PARAGRAPH_ADDED':
    //   this.splice('noteObj.notebook.paragraphs', data.index, 0, data.paragraph);
    //   break;
    //   case 'INTERPRETER_BINDINGS' :
    //   this.set('noteObj.notebook.interpreters', data.interpreterBindings);
    //   break;
    //   default:
    //   break;
    // }
  }
  // getObjectIndex(id) {
  //   var getObj = this.noteObj.notebook.paragraphs.find(function(item) {
  //     return item.id === id;
  //   });
  //   var getIndex = this.noteObj.notebook.paragraphs.indexOf(getObj);
  //   return getIndex;
  // }

  // runAllParas() {
  //   if (this.noteBook) {
  //     this.noteBook.runAllParas();
  //   }
  // }

  constructor() {
    super()
    var protocol = window.location.hostname === 'https:' ? 'wss' : 'ws';
    this.socketUrl = protocol + '://' + window.location.hostname;
  }
  detached() {
    this.$.socket.close();
  }
  exportNotebook() {
    if (this.noteBook) {
      this.noteBook.exportParagraph();
    }
  }

  // editTitle() {
  //   this._noteBookName = this.noteBookName;
  //   this.$$('.name-wrap').classList.add('edit-mode');
  // }

  // saveName() {
  //   this.set('noteBookName', this._noteBookName);
  //   this.$$('.name-wrap').classList.remove('edit-mode');
  //   this.noteBook.renameNoteBook();
  // }

  // cancelRename() {
  //   this.set('_noteBookName', this.noteBookName);
  //   this.$$('.name-wrap').classList.remove('edit-mode');
  // }

}

window.customElements.define(ZeppelinViewer.is, ZeppelinViewer);