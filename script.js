// ========================================
// NAVIGATION
// ========================================

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


    // ========================================
    // KATEGORI
    // ========================================

    const categoryElement =
        document.getElementById("category");

    const category =
        categoryElement
            ? categoryElement.value
            : "random";


    // ========================================
    // JUMLAH RONDE
    // ========================================

    let totalRounds = 5;

    if (
        typeof selectedRounds !== "undefined"
    ) {

        totalRounds =
            Number(selectedRounds);

    }


    // Pengaman jumlah ronde

    if (totalRounds < 1) {
        totalRounds = 1;
    }

    if (totalRounds > 20) {
        totalRounds = 20;
    }


    // ========================================
    // BUAT KODE ROOM
    // ========================================

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let roomCode = "";

    for (let i = 0; i < 6; i++) {

        const randomIndex =
            Math.floor(
                Math.random() * characters.length
            );

        roomCode +=
            characters[randomIndex];

    }


    // ========================================
    // SIMPAN ROOM
    // ========================================

    try {

        const { data, error } =
            await sb
                .from("rooms")
                .insert([
                    {
                        code: roomCode,
                        host_name: hostName,
                        max_players: selectedPlayers,
                        category: category,
                        total_rounds: totalRounds,
                        status: "waiting"
                    }
                ])
                .select()
                .single();


        // ========================================
        // ERROR
        // ========================================

        if (error) {

            console.error(error);

            alert(
                "❌ Gagal membuat room.\n\n" +
                error.message
            );

            return;
        }


        // ========================================
        // SIMPAN DATA ROOM
        // ========================================

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

        localStorage.setItem(
            "genz_total_rounds",
            data.total_rounds
        );


        // ========================================
        // MASUK KE ROOM
        // ========================================

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


    // ========================================
    // HOST
    // ========================================

    const hostDisplay =
        document.getElementById("hostDisplay");

    if (hostDisplay) {

        hostDisplay.textContent =
            hostName || "-";

    }


    // ========================================
    // MAX PLAYER
    // ========================================

    const maxPlayersElement =
        document.getElementById("maxPlayers");

    if (maxPlayersElement) {

        maxPlayersElement.textContent =
            maxPlayers || "6";

    }


    // ========================================
    // KATEGORI
    // ========================================

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
        document.getElementById(
            "categoryDisplay"
        );

    if (categoryDisplay) {

        categoryDisplay.textContent =
            categoryNames[category] ||
            "🎲 Random";

    }


    // ========================================
    // JUMLAH RONDE
    // ========================================

    const totalRounds =
        localStorage.getItem(
            "genz_total_rounds"
        );


    const totalRoundsElement =
        document.getElementById(
            "totalRounds"
        );


    if (totalRoundsElement) {

        totalRoundsElement.textContent =
            totalRounds || "5";

    }

}


// ========================================
// START GAME - SUPABASE
// ========================================

async function startGame() {

    const roomId =
        localStorage.getItem(
            "genz_room_id"
        );


    if (!roomId) {

        alert(
            "❌ Room ID tidak ditemukan."
        );

        return;
    }


    try {

        const { error } =
            await sb
                .from("rooms")
                .update({
                    status: "playing"
                })
                .eq(
                    "id",
                    roomId
                );


        if (error) {

            console.error(error);

            alert(
                "❌ Gagal memulai game.\n\n" +
                error.message
            );

            return;
        }


        console.log(
            "🚀 Game berhasil dimulai!"
        );


    } catch (error) {

        console.error(error);

        alert(
            "❌ Terjadi kesalahan saat memulai game."
        );

    }

}


// ========================================
// ROOM PAGE
// ========================================

if (
    window.location.pathname.includes(
        "room.html"
    )
) {

    loadRoomData();

}