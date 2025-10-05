const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendPushNotification = functions.database.ref('/latestNotification/{pushId}')
    .onCreate(async (snapshot, context) => {
        
        const notificationData = snapshot.val();
        console.log("New notification data received:", notificationData);

        if (!notificationData) {
            return console.log("Notification data is empty.");
        }

        const payload = {
            notification: {
                title: notificationData.title || "Bahari App",
                body: "Check out the new update!",
                imageUrl: notificationData.imageUrl || ""
            },
            webpush: {
                fcm_options: {
                  // এখানে আপনার ওয়েবসাইটের লিংক দিন
                  link: 'https://bahari-52fdb.web.app' 
                }
            }
        };

        try {
            // ডাটাবেসের '/fcmTokens' পাথ থেকে সব ব্যবহারকারীর টোকেন সংগ্রহ করা হচ্ছে
            const tokensSnapshot = await admin.database().ref('/fcmTokens').once('value');

            if (!tokensSnapshot.exists()) {
                console.log("No FCM tokens found in the database.");
                return;
            }

            const tokens = Object.keys(tokensSnapshot.val());

            if (tokens.length === 0) {
                console.log("Token list is empty.");
                return;
            }

            console.log(`Sending notification to ${tokens.length} devices.`);
            const response = await admin.messaging().sendToDevice(tokens, payload);
            console.log("Successfully sent message:", response);
            return response;

        } catch (error) {
            console.error("Error sending notification:", error);
        }
    });
