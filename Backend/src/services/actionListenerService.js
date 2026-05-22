import { db } from '../config/firebase.js';

/**
 * Service to listen for real-time actions from the frontend via Firebase.
 */
class ActionListenerService {
  constructor() {
    this.collectionName = 'frontend_actions';
    this.unsubscribe = null;
  }

  /**
   * Starts listening to the Firestore collection.
   */
  start() {
    console.log(`🎧 Starting listener on Firestore collection: ${this.collectionName}`);

    const query = db
      .collection(this.collectionName)
      .where('status', '==', 'pending');

    this.unsubscribe = query.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const actionId = change.doc.id;
            const actionData = change.doc.data();
            this.processAction(actionId, actionData);
          }
        });
      },
      (error) => {
        console.error('❌ Error listening to frontend actions:', error);
      }
    );
  }

  /**
   * Stops the listener.
   */
  stop() {
    if (this.unsubscribe) {
      this.unsubscribe();
      console.log('🛑 Stopped listening to frontend actions.');
    }
  }

  /**
   * Processes an individual action.
   * @param {string} id The document ID
   * @param {Object} data The document data
   */
  async processAction(id, data) {
    console.log(`⚙️ Processing action [${id}]:`, data.type);

    try {
      // Example processing logic based on action type
      switch (data.type) {
        case 'USER_LOGIN':
          console.log(`User logged in: ${data.userId}`);
          break;
        case 'ADD_TO_CART':
          console.log(`Product added to cart: ${data.productId}`);
          break;
        default:
          console.log(`Unhandled action type: ${data.type}`);
      }

      // Mark the action as completed in Firestore
      await db.collection(this.collectionName).doc(id).update({
        status: 'completed',
        processedAt: new Date().toISOString(),
      });

      console.log(`✅ Action [${id}] processed successfully.`);
    } catch (error) {
      console.error(`❌ Failed to process action [${id}]:`, error);

      // Optionally mark it as failed
      await db.collection(this.collectionName).doc(id).update({
        status: 'failed',
        error: error.message,
        failedAt: new Date().toISOString(),
      });
    }
  }
}

export default new ActionListenerService();
