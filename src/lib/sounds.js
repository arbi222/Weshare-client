const playSound = () => {
    const audio = new Audio("/assets/sounds/notification.mp3");
    audio.play().catch(err => {
        console.log(err);
    });
};

export default playSound;