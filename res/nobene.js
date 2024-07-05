//   Copyright (c) 2024 Nobene authors

//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at

//       http://www.apache.org/licenses/LICENSE-2.0

//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

function muid(tokenLen) {
  if (tokenLen == null) { tokenLen = 19; }
  var text = "";
  const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ023456789";
  for (var i = 0; i < tokenLen; ++i) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  };
  return text;
};

async function save(name) {
  var text = document.getElementById(name).innerText;
  if ( text.includes('?????') ) {
    delete_card(name);
    return;
  }
  if ( text.includes('+++++') ) {
    document.getElementById('in').value = '++' + name;
    return;
  }
  document.getElementById(name).innerHTML = text;
  console.log("\n name: " + name + ": " + text);
// console.log(mid);
  var fname = 'store/cards/' + name;
  var res = await vebview.fs.write_file(fname, text);
  if ( res == false ) {
    console.log('card writing error : ' + name);
  };
  var cname = document.getElementById(name).className;
  var fname2 = 'store/flags/' + name;
  var res2 = await vebview.fs.write_file(fname2, cname);
  if ( res2 == false ) {
    console.log('flags writing error for : ' + name);
  };
  return;
};

async function new_card(col) {
  var id = document.createAttribute('id');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var mid = muid(19);
  elem.innerHTML = '*';
  elem.setAttributeNode(cl);
  cl.value = '';
  elem.setAttributeNode(cedit);
  cedit.value = 'true';
  id.value = mid;
  elem.setAttributeNode(id);
  omo.value = 'save("' + mid + '");'
  odbl.value = 'hide("' + mid + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  document.getElementById(col).appendChild(elem);
  console.log('added brand new card : ' + mid);
  save(mid);
  var result = await vebview.fs.write_file('store/flags/' + mid, '');
    if ( result == false ) {
      console.log('flags file writing error for : ' + mid);
    };
  return mid;
};

async function set_card(col, caid) {
  var id = document.createAttribute('id');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var ocm = document.createAttribute('oncontextmenu');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var crd = await vebview.fs.read_file('store/cards/' + caid);
  if (crd === false) {
    console.log('failed to read card : ' + caid);
    crd = caid + ':\n failed to read card';
    var red = true;
  };
  elem.innerHTML = crd;
  if ( crd.substring(0,3) == '==>' ) {
    ocm.value = 'open_url("' + crd.substring(4,10) + '");'
    elem.setAttributeNode(ocm);
  };
  elem.setAttributeNode(cedit);
  elem.setAttributeNode(cl);
  cedit.value = 'true';
  id.value = caid;
  elem.setAttributeNode(id);
  omo.value = 'save("' + caid + '");'
  odbl.value = 'hide("' + caid + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  var flag = await vebview.fs.read_file('store/flags/' + caid);
  if (flag === false) {
    console.log('failed to read flags for : ' + caid);
    flag = '';
    var result2 = await vebview.fs.write_file('store/flags/' + caid, '');
    if ( result2 == false ) {
      console.log('flags file writing error for : ' + caid);
    };
  };
  cl.value = flag;
  if ( red == true ) {
    cl.value = 'red';
  };
  console.log('flag read was : ' + flag);
  document.getElementById(col).appendChild(elem);
  console.log('set new card ' + caid + ' in column : ' + col);
////  export_board();
  return;
};

async function clone_card(mid) {
  var id = document.createAttribute('id');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var crd = await vebview.fs.read_file('store/cards/' + mid);
  if (crd === false) {
    console.log('failed to read card : ' + mid);
    crd = caid + ':\n failed to read card';
    var red = true;
  };
  elem.innerHTML = crd;
  elem.setAttributeNode(cedit);
  elem.setAttributeNode(cl);
  cedit.value = 'true';
  var midnew = muid(19);
  id.value = midnew;
  elem.setAttributeNode(id);
  omo.value = 'save("' + midnew + '");'
  odbl.value = 'hide("' + midnew + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  var flag = await vebview.fs.read_file('store/flags/' + midnew);
  if (flag === false) {
    console.log('failed to read flags for : ' + midnew);
    flag = '';
    var result2 = await vebview.fs.write_file('store/flags/' + midnew, '');
    if ( result2 == false ) {
      console.log('flags file writing error for : ' + midnew);
    };
  };
  cl.value = flag;
  if ( red == true ) {
    cl.value = 'red';
  };
  console.log('flag read was : ' + flag);
  document.getElementById('3').appendChild(elem);
  console.log('add old card with new id ' + midnew + ' in Column 3');
  save(midnew);
  export_board();
  document.getElementById('in').value = '';
  return;
};

async function add_new_url_card(uid) {
  var id = document.createAttribute('id');
  var op = document.createAttribute('oncontextmenu');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var mid = muid(19);
  elem.setAttributeNode(cl);
  cl.value = '';
  elem.setAttributeNode(cedit);
  cedit.value = 'true';
  id.value = mid;
  elem.setAttributeNode(id);
  op.value = 'open_url("' + uid + '");'
  omo.value = 'save("' + mid + '");'
  odbl.value = 'hide("' + mid + '");'
  elem.setAttributeNode(op);
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  document.getElementById('3').appendChild(elem);
  document.getElementById(mid).innerHTML = '==> ' + uid;
  console.log('added new URL card : ' + mid);
  save(mid);
  var result = await vebview.fs.write_file('store/flags/' + mid, '');
    if ( result == false ) {
      console.log('flags file writing error for : ' + mid);
    };
  return mid;
};

async function hide_menu() {
  document.getElementById('menu').innerHTML = '';
  document.getElementById('menu').style.display = 'none';
  return;
};

async function show_all_boards() {
  var boards = await vebview.fs.read_dir('store/boards');
  var cur = await vebview.window.get_title();
  console.log('current: ' + cur);
  var ls = String(boards).replace(/,/g , ' ');
  var ls1 = ls.split(' ');
  var mn = '<div id="x" onclick="hide_menu();">✖</div><br>========================<br>';
  for ( x = 0; x < ls1.length; ++x ) {
    if ( ls1[x].includes('bup') ) {
      continue;
    };
    if ( ls1[x].includes('-') ) {
      continue;
    };
    if ( ls1[x] == cur ) {
      mn += '<a style="color: #8d7b68;" onclick=import_board("' + ls1[x] + '");>' + ls1[x] + '</a><br>';
      continue;
    };
    mn += '<a onclick=import_board("' + ls1[x] + '");>' + ls1[x] + '</a><br>';
  };
  mn += '<br>';
  document.getElementById('menu').innerHTML = mn;
  document.getElementById('menu').style.display = 'block';
  return;
};

async function new_board(name) {
  if ( name.length > 32 ) {
    name = name.substr(0 , 32);
  };
  var boards = await vebview.fs.read_dir('store/boards');
  console.log('boards dir : ' + boards);
  if ( boards.includes(name) === true ) {
    console.log('Board with name : ' + name + ' already exists, can not create it !');
    return;
  };
  const col1 = document.getElementById('1');
  while (col1.hasChildNodes()) {
    col1.removeChild(col1.firstChild);
  };
  const col2 = document.getElementById('2');
  while (col2.hasChildNodes()) {
    col2.removeChild(col2.firstChild);
  };
  const col3 = document.getElementById('3');
  while (col3.hasChildNodes()) {
    col3.removeChild(col3.firstChild);
  };
  const col4 = document.getElementById('4');
  while (col4.hasChildNodes()) {
    col4.removeChild(col4.firstChild);
  };
  const col5 = document.getElementById('5');
  while (col5.hasChildNodes()) {
    col5.removeChild(col5.firstChild);
  };
  console.log('New Board created : ' + name);
  var cid = new_card('1');
  var act = '';
  act += cid + '-';
  cid = new_card('1');
  act += cid + '-';
  cid = new_card('1');
  act += cid + '-';
  cid = new_card('1');
  act += cid + '/';
  cid = new_card('2');
  act += cid + '-';
  cid = new_card('2');
  act += cid + '-';
  cid = new_card('2');
  act += cid + '-';
  cid = new_card('2');
  act += cid + '/';
  cid = new_card('3');
  act += cid + '-';
  cid = new_card('3');
  act += cid + '-';
  cid = new_card('3');
  act += cid + '-';
  cid = new_card('3');
  act += cid + '/';
  cid = new_card('4');
  act += cid + '-';
  cid = new_card('4');
  act += cid + '-';
  cid = new_card('4');
  act += cid + '-';
  cid = new_card('4');
  act += cid + '/';
  cid = new_card('5');
  act += cid + '-';
  cid = new_card('5');
  act += cid + '-';
  cid = new_card('5');
  act += cid + '-';
  var emoid = add_emoset();
  act += emoid;
  vebview.window.set_title(name);
  var factual = 'store/boards/' + name;
  var resu = await vebview.fs.write_file(factual, act);
  if ( resu == false ) {
    console.log('actual file writing error : ' + name);
  };
  cid = '0';
  act = '';
  document.getElementById('in').value = '';
  export_board();
  return;
};

async function delete_board() {
  var nam = await vebview.window.get_title();
  var del = await vebview.fs.remove_file('store/boards/' + nam);
  if (del === false) {
    console.log('failed to delete board : ' + nam);
  };
  import_board('help');
  return;
};

async function import_board(name) {
  if ( name[0] === ' ' ) {
    name = name.substr(1,);
    console.log('==' + name);
  };
  var bact = await vebview.fs.read_file('store/boards/' + name);
  if (bact === false) {
    console.log('failed to import board : ' + name);
    return;
  };
  const col1 = document.getElementById('1');
  while (col1.hasChildNodes()) {
    col1.removeChild(col1.firstChild);
  };
  const col2 = document.getElementById('2');
  while (col2.hasChildNodes()) {
    col2.removeChild(col2.firstChild);
  };
  const col3 = document.getElementById('3');
  while (col3.hasChildNodes()) {
    col3.removeChild(col3.firstChild);
  };
  const col4 = document.getElementById('4');
  while (col4.hasChildNodes()) {
    col4.removeChild(col4.firstChild);
  };
  const col5 = document.getElementById('5');
  while (col5.hasChildNodes()) {
    col5.removeChild(col5.firstChild);
  };
  try {
    var bd = bact.split('/');
    var c1 = bd[0].split('-');
    var c2 = bd[1].split('-');
    var c3 = bd[2].split('-');
    var c4 = bd[3].split('-');
    var c5 = bd[4].split('-');
  } catch (e) {
    if (e) {
      import_board('help');
      return;
    };
  };
  c1.forEach(set_column1);
  async function set_column1(card1) {
    set_card('1', card1);
  };
  c2.forEach(set_column2);
  async function set_column2(card2) {
    set_card('2', card2);
  };
  c3.forEach(set_column3);
  async function set_column3(card3) {
    set_card('3', card3);
  };
  c4.forEach(set_column4);
  async function set_column4(card4) {
    set_card('4', card4);
  };
  c5.forEach(set_column5);
  async function set_column5(card5) {
    set_card('5', card5);
  };
  vebview.window.set_title(name);
  console.log('imported board : ' + name);
  document.getElementById('in').value = '';
  document.getElementById('menu').style.display = 'none';
  return;
};

async function export_board() {
  var act2 = '';
  var nm = await vebview.window.get_title();
  var cn1 = await document.getElementById('1').childNodes;
  for ( var i = 0; i < cn1.length; i++) {
    act2 += cn1[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn2 = await document.getElementById('2').childNodes;
  for ( var i = 0; i < cn2.length; i++) {
    act2 += cn2[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn3 = await document.getElementById('3').childNodes;
  for ( var i = 0; i < cn3.length; i++) {
    act2 += cn3[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn4 = await document.getElementById('4').childNodes;
  for ( var i = 0; i < cn4.length; i++) {
    act2 += cn4[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn5 = await document.getElementById('5').childNodes;
  for ( var i = 0; i < cn5.length; i++) {
    act2 += cn5[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  console.log('Actual to export : ' + act2);
  var res2 = await vebview.fs.copy_file('store/boards/' + nm, 'store/boards/' + nm + '-bup');
  if ( res2 == false ) {
    console.log('actual backup  fs writing error in export : ' + nm);
  };
  var res3 = await vebview.fs.write_file('store/boards/' + nm, act2);
  if ( res3 == false ) {
    console.log('actual file writing error in export : ' + nm);
  };
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const date = new Date();
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const dstr = `${day}${month}${year}`;
  var res4 = await vebview.fs.write_file('store/boards/' + nm + '-' + dstr, act2);
  if ( res4 == false ) {
    console.log('actual file writing error in export : ' + nm + '-' + dstr);
  };
  act2 = '';
  console.log('exported board : ' + nm + ' : OK');
  nm = '';
  document.getElementById('in').value = '';
  return;
};

async function readkb(val) {
  console.log('read from CLI : ' + val);
  if ( val === 'quit' || val === '---' ) {
    var r = await vebview.window.close();
    return;
  };
  if ( val === '/delete' ) {
    delete_board();
    return;
  };
  if ( val === '/' ) {
    show_all_boards();
    return;
  };
  if ( val === '>>' ) {
    export_board();
    return;
  };
  if ( val[0] == '+' && val[1] == '+' && val.length == 21 ) {
    clone_card(val.substring(2,));
    console.log('added existing card with id : ' + val.substring(2,));
    return;
   };
  if ( val[0] == '+' && val.length > 2 ) {
    new_board(val.substring(1,));
    console.log('added new board with name : ' + val.substring(1,));
    return;
   };
  if ( val[0] == '#' ) {
    save_url(val.substring(1,));
  };
  val2 = val.substring(1,);
  if ( val[0] === '+' ) {
    if (val2 === '1') {
      new_card('1');
      export_board();
    };
    if (val2 === '2') {
      new_card('2');
      export_board();
    };
    if (val2 === '3') {
      new_card('3');
      export_board();
    };
    if (val2 === '4') {
      new_card('4');
      export_board();
    };
    if (val2 === '5') {
      new_card('5');
      export_board();
    };
  };
  if ( val[0] == '>' ) {
    import_board(val.substring(1,));
  };
  document.getElementById('in').value = val;
  console.log("val : " + val);
  val = '';
  val2 = '';
  document.getElementById('in').value = '';
  return;
};

async function hide(name) {
  const element = document.getElementById(name);
  if (element.className == '') {
    element.className = 'yell';
    var resul = await vebview.fs.write_file('store/flags/' + name, 'yell');
    if ( resul == false ) {
      console.log('flags file writing error : ' + name);
    };
    return;
  }
  if (element.className == 'yell' ) {
    element.className = 'hid';
    var resul = await vebview.fs.write_file('store/flags/' + name, 'hid');
    if ( resul == false ) {
      console.log('flags file writing error : ' + name);
    };
    return;
  }
  if (element.className == 'hid' ) {
    element.className = '';
    var resul = await vebview.fs.write_file('store/flags/' + name, '');
    if ( resul == false ) {
      console.log('flags file writing error : ' + name);
    };
  }
  if (element.className == 'red' ) {
    element.className = '';
    var resul = await vebview.fs.write_file('store/flags/' + name, '');
    if ( resul == false ) {
      console.log('flags file writing error : ' + name);
    };
  }
  return;
};

async function delete_card(name) {
  var dcard = document.getElementById(name)
  dcard.remove();
  export_board();
  console.log('deleted card : ' + name);
  return;
};

async function add_emoset() {
  var id = document.createAttribute('id');
  var cedit = document.createAttribute('contenteditable');
  var cl = document.createAttribute('class');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  elem.innerText = '🃏  ✔ ⚫ ♻️  ☀️  🌐️  ☘  ☎ ⚒  ☢  ☯ ☸ ✖  ◼  ⚑ ☂ ★ ♬  ⚓  ✪  ⁂  ♛  ☰  ◆  ∯  ♚  ♞  ♥   🐵️  ✡️  ☀️   ⚖';
  elem.setAttributeNode(cedit);
  elem.setAttributeNode(cl);
  cl.value = '';
  cedit.value = 'true';
  var mid3 = '000' + muid(16);
  id.value = mid3;
  elem.setAttributeNode(id);
  omo.value = 'save("' + mid3 + '");'
  odbl.value = 'hide("' + mid3 + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  elem.setAttributeNode(cl);
  document.getElementById('5').appendChild(elem);
  console.log('added emocard : ' + mid3);
  save(mid3);
  return mid3;
};

async function save_url(url) {
  var uid = muid(6);
  var res6 = await vebview.fs.write_file('store/urls/' + uid, url);
    if ( res6 == false ) {
      console.log('short_URL file writing error : ' + uid);
    };
  add_new_url_card(uid);
  return;
};

async function open_url(uid) {
  console.log('clicked to open URL : ' + uid);
  console.log('open_url with UID : ' + uid);
  var url = await vebview.fs.read_file('store/urls/' + uid);
  if (url === false) {
    console.log('failed to read URL file : ' + uid);
    return;
  };
  vebview.os.open_in_browser(url);
  return;
};