async function onSubmitSignal({signal}, authToken, responseCb) {
    console.log("submitting signal: ", this.user.playerData);

    if (this.user.playerData.signal == null) {
        this.user.playerData.signal = signal;
    }

    if (this.user.playerData.isAdmin == true &&
    this.room.client && this.room.client.playerData.signal != null) {
        console.log("admin set signal, remove client signal");
        this.room.client.playerData.signal = null;
    }

    this.room.socketRoom.emit("signal-emitted", this.user.playerData.isAdmin, this.room.constructSnapshotMessage());
}

export {
    onSubmitSignal
}