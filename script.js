function openHost() {
    window.location.href = "host.html";
}

function openPlayer() {
    window.location.href = "player.html";
}


// ========================================
// PLAYER COUNTER
// ========================================

let selectedPlayers = 6;

function changePlayers(change) {

    selectedPlayers += change;

    if (selectedPlayers < 2) {
        selectedPlayers = 2;
    }

    if (selectedPlayers > 6) {
        selectedPlayers = 6;
    }

    const playerCount =
        document.getElementById("playerCount");

    if (playerCount) {
        playerCount.textContent = selectedPlayers;
    }
}


// ========================================
// CREATE ROOM - SUPABASE
// ========================================

async function generateRoom() {

    const hostNameInput =
        document.getElementById("hostName");

    if (!hostNameInput) {
        return;
    }

    const hostName =
        hostNameInput.value.trim();

    if (hostName === "") {

        alert(
            "👑 Silakan masukkan nama Host terlebih dahulu."
        );

        return;
    }


    const categoryElement =
        document.getElementById("category");

    const category =
        categoryElement
            ? categoryElement.value
            : "random";


    // Membuat kode room 6 karakter
    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let roomCode = "";

    for (let i = 0; i < 6; i++) {

        const randomIndex =
            Math.floor(
                Math.random() * characters.length
            );

        roomCode += characters[randomIndex];
    }


    try {

        // Simpan room ke Supabase
        const { data, error } =
            await sb
                .from("rooms")
                .insert([
                    {
                        code: roomCode,
                        host_name: hostName,
                        max_players: selectedPlayers,
                        category: category,
                        status: "waiting"
                    }
                ])
                .select()
                .single();


        // Jika terjadi error
        if (error) {

            console.error(error);

            alert(
                "❌ Gagal membuat room.\n\n" +
                error.message
            );

            return;
        }


        // Simpan data room di HP Host
        localStorage.setItem(
            "genz_host",
            hostName
        );

        localStorage.setItem(
            "genz_room",
            data.code
        );

        localStorage.setItem(
            "genz_players",
            data.max_players
        );

        localStorage.setItem(
            "genz_category",
            data.category
        );

        localStorage.setItem(
            "genz_room_id",
            data.id
        );


        // Masuk ke halaman room
        window.location.href =
            "room.html";


    } catch (error) {

        console.error(error);

        alert(
            "❌ Terjadi kesalahan saat membuat room."
        );
    }
}


// ========================================
// LOAD ROOM DATA
// ========================================

function loadRoomData() {

    const roomCode =
        localStorage.getItem("genz_room");

    const hostName =
        localStorage.getItem("genz_host");

    const maxPlayers =
        localStorage.getItem("genz_players");

    const category =
        localStorage.getItem("genz_category");


    const roomElement =
        document.getElementById("roomCode");

    if (!roomElement) {
        return;
    }


    roomElement.textContent =
        roomCode || "------";


    const hostDisplay =
        document.getElementById("hostDisplay");

    if (hostDisplay) {

        hostDisplay.textContent =
            hostName || "-";
    }


    const maxPlayersElement =
        document.getElementById("maxPlayers");

    if (maxPlayersElement) {

        maxPlayersElement.textContent =
            maxPlayers || "6";
    }


    const categoryNames = {

        "random":
            "🎲 Random",

        "general":
            "📚 Pengetahuan Umum",

        "genz":
            "🔥 Gen Z",

        "random-question":
            "🤪 Pertanyaan Random"

    };


    const categoryDisplay =
        document.getElementById("categoryDisplay");

    if (categoryDisplay) {

        categoryDisplay.textContent =
            categoryNames[category] ||
            "🎲 Random";
    }
}


// ========================================
// START GAME
// ========================================

function startGame() {

    alert(
        "🚀 GAME SIAP!\n\n" +
        "Sistem permainan akan kita bangun pada tahap berikutnya."
    );
}


// ========================================
// ROOM PAGE
// ========================================

if (
    window.location.pathname.includes("room.html")
) {

    loadRoomData();

}