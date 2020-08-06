import Caver from "caver-js";

const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}
const cav = new Caver(config.rpcURL); // instance

const App = {
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  },
  // 세션 확인
  start: async function () {
    const walletFromSession = sessionStorage.getItem('walletInstance'); //키값을 불러서 상수로 저장
    if (walletFromSession) { // walletFromsession에 값이 있는지 확인
      try{
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession)); // cav-wallet에 해당 계정 정보를 다시 넣음
        this.changeUI(JSON.parse(walletFromSession)); // login 되었으므로 UI 업데이트 (로그인된 화면)
      } catch (e) { // 유효한 계정 정보가 아닌경우
        sessionStorage.removeItem('walletInstance'); // 정보 지움
      }
    }
  },

// 유효한 키스토어 파일인지 확인
handleImport: async function () {
  const fileReader = new FileReader();
  fileReader.readAsText(event.target.files[0]); //file 선택
  fileReader.onload = (event) => { // 선택 후 확인
    try{
      if (!this.checkValidKeystore(event.target.result)){ // 올바른 키스토어 파일인지 확인
        $('#message').text('유효하지 않은 keystore 파일입니다.');
        return;
      } //검증통과
      this.auth.keystore = event.target.result;
      $('#message').text('keysore 통과. 비밀번호를 입력하세요.');
      document.querySelector('#input-password').focus();
    } catch (event) {
      $('#message').text('유효하지 않은 keystore 파일입니다.');
      return;
    }
  }
},

  handlePassword: async function () {
    this.auth.password= event.target.value;
  },

  handleLogin: async function () {
    if (this.auth.accessType === 'keystore') {
      try{ //caver instance 활용
        //키스토어와 비밀번호로 비밀키(privateKey)를 가져옴
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey);
      } catch (e) {
        $('#message').text('비밀번호가 일치하지 않습니다.');
      }
    }
  },

  handleLogout: async function () {
    this.removeWallet(); //wallet clear, session clear
    location.reload(); // page restart
  },

  generateNumbers: async function () {

  },

  submitAnswer: async function () {

  },

  deposit: async function () {

  },

  callOwner: async function () {

  },

  callContractBalance: async function () {

  },

  getWallet: function () {

  },

  checkValidKeystore: function (keystore) {
    const parseKeystore = JSON.parse(keystore); //키스토어파일을 JSON파일로 변경
    const isValidKeystore = parseKeystore.version && // 키스토어파일이라면 version, id, address, crypto를 가지고 있음
      parseKeystore.id &&
      parseKeystore.address &&
      parseKeystore.crypto;

      return isValidKeystore;
  },

  // 계정정보 확인하는 function
  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    cav.klay.accounts.wallet.add(walletInstance); // caver instance를 통해 계정 정보를 쉽게 가져올 수 있음
    //웹브라우저 공간에 wallet 계속 저장 - 브라우저 꺼지기 전까지
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance)); //계정이 로그인된 상태를 유지하기 위해 사용 - 계정정보 유지
    this.changeUI(walletInstance);
  },

  reset: function () {
    this.auth = {
      kestore: '',
      password: ''
    };
  },


  reset: function () {

  },

  //TODO
  changeUI: async function (walletInstance) {
    $('#loginModal').modal('hide');
    $('#login').hide();
    $('#logout').show();
    // $('#game').show();
    $('#address').append('<br>' + '<p>' + '내 계정주소: ' + walletInstance.address + '</p>');
    // $('#contractBalance') // contract 잔액 불러오기
    // .append('<p>' + '이벤트 잔액: ' + cav.utils.fromPeb(await this.callContractBalance(), "KLAY") + 'KLAY'+ '<p>'); 

    if (await this.callOwner() === walletInstance.address) { // 로그인된 계정이 owner인 경우에만
      $('#owner').show(); // owner부분을 보여주도록 설정
    }
  },

  removeWallet: function () {

  },

  showTimer: function () {

  },

  showSpinner: function () {

  },

  receiveKlay: function () {

  }
};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};