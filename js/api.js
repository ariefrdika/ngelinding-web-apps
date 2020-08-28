var api_token = '40d8536df0e14544acaee48e45677474'
var id_liga = 2002 //id liga Jerman
var base_url2 = "https://api.football-data.org/v2/";
var endpoint_bracket_liga = `${base_url2}competitions/${id_liga}/standings?standingType=TOTAL`
var endpoint_scheduled = `${base_url2}competitions/${id_liga}/matches?status=SCHEDULED`

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json
function getBracketLiga() {
  if ('caches' in window) {
    caches.match(endpoint_bracket_liga).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var aJSONtoHTML = ''
          data.standings.forEach(function (value) {
            var temp = ''
            value.table.forEach(function (singleValue) {
              singleValue = JSON.parse(JSON.stringify(singleValue).replace(/http:/g, 'https:'));
              lastUpdateBracket = new Date(data.competition.lastUpdated);

              temp += `
              <tr>
                <td class="center-align">${singleValue.position}</td>
                <td><img class = "show-on-medium-and-up show-on-medium-and-down" src=${singleValue.team.crestUrl} width="45px" height="40px"></td>
                <td>${singleValue.team.name}</td>
                <td class="center-align">${singleValue.playedGames}</td>
                <td class="center-align">${singleValue.won}</td>
                <td class="center-align">${singleValue.draw}</td>
                <td class="center-align">${singleValue.lost}</td>
                <td class="center-align"><b>${singleValue.points}</b></td>
              </tr>`

            })

            aJSONtoHTML += `
              <h2><b>Bracket Liga Jerman</b></h2>
              <p>Lastupdate at : ${lastUpdateBracket.toDateString()}</p>
              <hr>
              <table class="responsive-table striped " >
              <thead>
                <tr>
                  <th class="center-align">#</th>
                  <th colspan="2" style="text-align:center;">Teams</th>
                  <th class="center-align">Play</th>
                  <th class="center-align">Win</th>
                  <th class="center-align">Draw</th>
                  <th class="center-align">Lost</th>
                  <th class="center-align">Points</th>
                </tr>
              </thead>
              <tbody>` + temp + `</tbody>
              </table>
            `

          });
          document.getElementById("contentBracket").innerHTML = aJSONtoHTML;
        });
      }
    });
  }

  fetch(endpoint_bracket_liga, {
    headers: {
      'X-Auth-Token': api_token
    }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      var aJSONtoHTML = ''
      data.standings.forEach(function (value) {
        var temp = ''
        value.table.forEach(function (singleValue) {
          singleValue = JSON.parse(JSON.stringify(singleValue).replace(/http:/g, 'https:'));
          lastUpdateBracket = new Date(data.competition.lastUpdated);

          temp += `
          <tr>
            <td class="center-align">${singleValue.position}</td>
            <td><img class = "show-on-medium-and-up show-on-medium-and-down" src=${singleValue.team.crestUrl} width="45px" height="40px"></td>
            <td>${singleValue.team.name}</td>
            <td class="center-align">${singleValue.playedGames}</td>
            <td class="center-align">${singleValue.won}</td>
            <td class="center-align">${singleValue.draw}</td>
            <td class="center-align">${singleValue.lost}</td>
            <td class="center-align"><b>${singleValue.points}</b></td>
          </tr>`

        })

        aJSONtoHTML += `
          <h2><b>Bracket Liga Jerman</b></h2>
          <p>Lastupdate at : ${lastUpdateBracket.toDateString()}</p>
          <hr>
          <table class="responsive-table striped">
          <thead>
            <tr>
              <th class="center-align">#</th>
              <th colspan="2" style="text-align:center;">Teams</th>
              <th class="center-align">Play</th>
              <th class="center-align">Win</th>
              <th class="center-align">Draw</th>
              <th class="center-align">Lost</th>
              <th class="center-align">Points</th>
            </tr>
          </thead>
          <tbody>` + temp + `</tbody>
          </table>
        `

      });
      document.getElementById("contentBracket").innerHTML = aJSONtoHTML;
    })
}

function getMatchup() {
  if ('caches' in window) {
    caches.match(endpoint_scheduled).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var dataMatchesHtml = '';

          //Cari dari 10 data minimal yang matchdaynya sama dengan index ke 0 dari data
          temp = 0;
          for (let i = 0; i < 10; i++){
            if (data.matches[0].matchday == data.matches[i].matchday){
              temp++;
            }
          }
          dataMatchesHtml += `<h2><b>Match days</b></h2><hr>`
          for (let i = 0; i < temp; i++) {
            dataMatchesHtml += `
            <div class="col s12 z-depth-2 grey lighten-2" style="padding:20px; margin-top:20px;">
              <span class="badge"><a class="btn-floating pulse light-blue lighten-3" href="#" onclick="addFavoritMatch(this);" data-team='${JSON.stringify(data.matches[i])}'><i class="large material-icons" id="iconNya">timer</i></a></span>
              <table class="centered">
                <thead>
                  <tr>
                    <td colspan="3" style="text-align:center;"><h3><b>Matchday : ${data.matches[i].matchday}</b></h3></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="3">${new Date(data.matches[i].utcDate).toDateString()}</td>
                  </tr>
                  <tr>
                    <td width='40%'><h6><b>Home</b></h6></td>
                    <td width='10%'>&nbsp;</td>
                    <td width='40%'><h6><b>Away</b></h6></td>
                  </tr>
                  <tr>
                    <td width='40%'><h5><b><i>${data.matches[i].homeTeam.name}</b></i></h5></td>
                    <td width='10%'>VS</td>
                    <td width='40%'><h5><b><i>${data.matches[i].awayTeam.name}</b></i></h5></td>
                  </tr>
                </tbody>
              </table>
            </div>
                  `
              }
              // Sisipkan komponen card ke dalam elemen
              document.getElementById("contentMatch").innerHTML = dataMatchesHtml;
              resolve(data);
        });
      }
    });
  }

  fetch(endpoint_scheduled, {
    headers: {
      'X-Auth-Token': api_token
    }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      var dataMatchesHtml = '';

      //Cari dari 10 data minimal yang matchdaynya sama dengan index ke 0 dari data
      temp = 0;
      for (let i = 0; i < 10; i++){
        if (data.matches[0].matchday == data.matches[i].matchday){
          temp++;
        }
      }
      dataMatchesHtml += `<h2><b>Match days</b></h2><hr>`
      for (let i = 0; i < temp; i++) {
        dataMatchesHtml += `
        <div class="col s12 z-depth-2 grey lighten-2" style="padding:20px; margin-top:20px;">
          <span class="badge"><a class="btn-floating pulse light-blue lighten-3" href="#" onclick="addFavoritMatch(this);" data-team='${JSON.stringify(data.matches[i])}'><i class="large material-icons" id="iconNya">timer</i></a></span>
          <table class="centered">
            <thead>
              <tr>
                <td colspan="3" style="text-align:center;"><h3><b>Matchday : ${data.matches[i].matchday}</b></h3></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="3">${new Date(data.matches[i].utcDate).toDateString()}</td>
              </tr>
              <tr>
                <td width='40%'><h6><b>Home</b></h6></td>
                <td width='10%'>&nbsp;</td>
                <td width='40%'><h6><b>Away</b></h6></td>
              </tr>
              <tr>
                <td width='40%'><h5><b><i>${data.matches[i].homeTeam.name}</b></i></h5></td>
                <td width='10%'>VS</td>
                <td width='40%'><h5><b><i>${data.matches[i].awayTeam.name}</b></i></h5></td>
              </tr>
            </tbody>
          </table>
        </div>
              `
          }

          // Sisipkan komponen card ke dalam elemen
          document.getElementById("contentMatch").innerHTML = dataMatchesHtml;
          resolve(data);
    })
    .catch(error);
}

function addFavoritMatch(data){
  var team = JSON.parse(data.getAttribute('data-team'))
  console.log(team);
  var dbPromise = idb.open("db_pwa_2_dicoding", 1, function (upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("match_fav")) {
      var indexedMatch = upgradeDb.createObjectStore("match_fav", {
          keyPath: "id"
      });
      indexedMatch.createIndex("home", "homeTeam.name", {
          unique: false
      });
      indexedMatch.createIndex("away", "awayTeam.name", {
          unique: false
      });
    }
  });

  console.log("CARI DATA");
  dbPromise.then(function(db) {
    var tx = db.transaction('match_fav', 'readonly');
    var store = tx.objectStore('match_fav');
    // mengambil primary key berdasarkan isbn
    console.log(team.id);
    return store.get(team.id);
  }).then(function(val) {
    if(!val){
      console.log("Tidak ada data dgn id");
      dbPromise.then(db => {
          var tx = db.transaction('match_fav', 'readwrite');
          var store = tx.objectStore('match_fav');
          store.add(team);

          return tx.complete;
      }).then(function () {
          console.log('Data berhasil disimpan');
      }).catch(function () {
          console.log('ada yang error');
      });
    }else{
      console.log("MASUK VAL" + val.id);
      console.log("ada dong");
      console.dir(val);
      dbPromise.then(function(db) {
        var tx = db.transaction('match_fav', 'readwrite');
        var store = tx.objectStore('match_fav');
        store.delete(team.id);

        return tx.complete;
      }).then(function() {
        console.log('Tidak fav lagi');
      });
    }
  });
  data.remove;
}

function getAllData() {
    var dbPromise = idb.open("db_pwa_2_dicoding", 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("match_fav")) {
        var indexedMatch = upgradeDb.createObjectStore("match_fav", {
            keyPath: "id"
        });
        indexedMatch.createIndex("home", "homeTeam.name", {
            unique: false
        });
        indexedMatch.createIndex("away", "awayTeam.name", {
            unique: false
        });
      }
    });

    dbPromise.then(function(db) {
    var tx = db.transaction('match_fav', 'readonly');
    var store = tx.objectStore('match_fav');

    return store.getAll();
  }).then(function(items) {
    showData = ""
    items.forEach(function (item){
      console.log(item);
      showData += `
      <div class="col s12 z-depth-2 grey lighten-2" style="padding:20px; margin-top:20px;">
        <table class="centered">
          <thead>
            <tr>
              <td colspan="3" style="text-align:center;"><h3><b>Matchday : ${item.matchday}</b></h3></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3">${new Date(item.utcDate).toDateString()}</td>
            </tr>
            <tr>
              <td width='40%'><h6><b>Home</b></h6></td>
              <td width='10%'>&nbsp;</td>
              <td width='40%'><h6><b>Away</b></h6></td>
            </tr>
            <tr>
              <td width='40%'><h5><b><i>${item.homeTeam.name}</b></i></h5></td>
              <td width='10%'>VS</td>
              <td width='40%'><h5><b><i>${item.awayTeam.name}</b></i></h5></td>
            </tr>
          </tbody>
        </table>
      </div>
            `
    });
    document.getElementById("contentFav").innerHTML = showData;
  });
}
