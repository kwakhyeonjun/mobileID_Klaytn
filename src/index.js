/**
 * TODO!
 *  - getHost(address)의 return이 3개인데 어떻게 처리함요 
 *  - 
 * 
 * Note
 * - 현재 계정 정보 확인 : const walletInstance = getWallet();
 */

import Caver from "caver-js";
import {Spinner} from "Spin.js";

const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}
const cav = new Caver(config.rpcURL); // instance
const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS); 

const App = {
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: '',
    address: ''
    //개인주소 추가
  },

  host:{
    name: '',
    id_num: '',
    phone: ''
  },

  // 세션 확인, 최초 실행부
  start: async function () {
    const walletFromSession = sessionStorage.getItem('walletInstance'); //키값을 불러서 상수로 저장

    if (walletFromSession) { // walletFromsession에 값이 있는지 확인
      console.log("Session has wallet");
      try{
        // cav.klay.accounts.wallet이 현재 진행하는 계정 정보
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession)); // cav-wallet에 해당 계정 정보를 다시 넣음
        this.changeUI_Login_notData(JSON.parse(walletFromSession)); // login 되었으므로 UI 업데이트 (로그인된 화면)

      } catch (e) { // 유효한 계정 정보가 아닌경우
        sessionStorage.removeItem('walletInstance'); // 정보 지움
      } 
      const hostFromSession = sessionStorage.getItem('hostData');

      console.log("host Session = " + JSON.parse(hostFromSession)); 
    
      // JSON.parse(walletFromSession).address = 현재 계정 주소
      if(JSON.parse(hostFromSession)) { // 기능구현 - 세션에 host 저장한 경우
        console.log("Session has Host Data")
        try {
          this.host = JSON.parse(hostFromSession);
          this.changeUI_Login_hasData();
        } catch (e) {
          sessionStorage.removeItem('hostData');
        }
      } else { // TODO
        console.log("Session doesn't have data")
        if(this.checkValidHost(JSON.parse(walletFromSession).address)){ // 현재 계정 주소로 가입되어있는지 확인
          console.log("this user has host data")
          // 회원탈퇴하는 버튼 필요
          // 계정 정보 불러오기

          // TODO!!!!!! 배열로 바꿔야하나
          this.host = this.getHostFromContracts(JSON.parse(walletFromSession).address);

          this.changeUI_Login_hasData();
        } else { // 임시 else
          console.log("this user doesn't have data")
        }
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
      document.querySelector('#input-password').focus();.2
      +362
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

  deposit: async function () {

  },

  callOwner: async function () {
    return await agContract.methods.owner().call();
  },

  // 아마 안쓸듯
  callContractBalance: async function () {
    return await agContract.methods.getBalance().call();
  },

  getWallet: function () {
    if (cav.klay.accounts.wallet.length) { // cav.klay-wallet에 계정이 있다면
      return cav.klay.accounts.wallet[0]; // 첫번째 계정 = 내가 로그인된 계정
    }
  },

  // 비용절감 필요
  getHostFromContracts: async function (address) {
    return await agContract.methods.getHost(address).call();
  },

  checkValidHost: async function (address) {
    const tempHost = this.getHostFromContracts(address); // 현재 진행하는 계정의 정보가 block에 있는지 확인하기 위해 host정보 확인
    //TODO
    const isHost = tempHost.name &&
                  tempHost.id_num &&
                  tempHost.phone;
    return isHost;
  },

  // 유효한 키스토어 파일인지 확인
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
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance)); //계정이 로그인된 상태를 유지하기 위해 사용 - 계정정보 유지 - sessionStorage에 정보저장!!!!!!  
    
    // TODO : 다음 화면 확정지어야함;
    location.reload();
  },

  reset: function () {
    this.auth = {
      kestore: '',
      password: ''
    };
  },

  resetHost: function (){
    this.host = {
      name: '',
      id_num: '',
      phone: ''
    }
  },

  // 1. 로그아웃UI 2. 로그인 - 정보없음UI 3. 로그인 - 정보있음UI
  
  /**
   * 로그인 되었지만 Data는 없는 경우
   * @param {}} walletInstance 
   */
  changeUI_Login_notData: async function (walletInstance) {
    $('#loginModal').modal('hide');
    $('#login').hide();
    $('#logout').show();
    
    $('#host_input').show();
    $('#host_data').hide();
    $('#host_session_out').hide();
    $('#address').append('<br>' + '<p>' + '내 계정주소: ' + walletInstance.address + '</p>');
    
    // if (await this.callOwner() === walletInstance.address) { // 로그인된 계정이 owner인 경우에만
    //   $('#owner').show(); // owner부분을 보여주도록 설정
    // }
  },

  /**
   * Success - 로그인 데이터가 있는 경우 화면 출력
   */
  changeUI_Login_hasData: async function () {
    
    $('#loginModal').modal('hide');
    $('#login').hide();
    $('#logout').show();
    $('#host_input').remove();
  
    $('#host_data').show();
    $('#host_session_out').show();
    $('#host_data').append('<br>' + '<p>' + '이름: ' + this.host.name + '</p>' + '<br>'
                          + '<p>' + '주민등록번호: ' + this.host.id_num + '</p>' + '<br>'
                          + '<p>' + '전화번호: ' + this.host.phone + '</p>' + '<br>');
  },

  // 형식에 맞춰 입력하면 컨트랙트로 블록에 올리는 부분!!
  inputHostData: async function () {
    var spinner = this.showSpinner();
    
    // html에서 입력받은 값 host에 저장함
    this.host.name = document.getElementById("host_name").value;
    this.host.id_num = document.getElementById("host_id_front").value + "-" + document.getElementById("host_id_rear").value;
    this.host.phone = document.getElementById("host_phone").value;

    const walletInstance = this.getWallet(); // 로그인된 계정 정보 확인
    // 추가부분
    if(walletInstance) { // 계정 정보 존재하는지 확인
      if(this.host) {// 정확히 구현필요
        agContract.methods.setHost(walletInstance.address, this.host.name, this.host.id_num, this.host.phone).send({
          from: walletInstance.address,
          gas: '250000' 
        })
        .once('transactionHash', (txHash) => { // transaction hash로 return 받는 경우
          console.log(`txHash: ${txHash}`);
        })
        .once('receipt', (receipt) => { // receipt(영수증)으로 return받는 경우
          console.log(`(#${receipt.blockNumber})`, receipt); // 어느 블록에 추가되었는지 확인할 수 있음
          spinner.stop(); // loading ui 종료
          alert(JSON.stringify(this.host) + "로 컨트랙에 저장했습니다."); // 입력된 host 정보
          // location.reload();
          sessionStorage.setItem('hostData', JSON.stringify(this.host));
          this.changeUI_Login_hasData();
        })
        .once('error', (error) => { // error가 발생한 경우
          alert(error.message);
        });
      } return; // host 정보 없으면 종료
    }
  },

  hostSessionOut: function () {
    sessionStorage.removeItem('hostData');
    this.resetHost();
    location.reload();
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
  },

  showTimer: function () {

  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
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