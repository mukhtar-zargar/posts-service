import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";
import { Topics, UserEvents } from "../constants/messaging.constants";

class UserConsumer {
  onUserSignup(): SubscriptionParameters {
    return {
      topic: Topics.UserService,
      eventTypes: [UserEvents.Signup],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  onUserSignIn(): SubscriptionParameters {
    return {
      topic: Topics.UserService,
      eventTypes: [UserEvents.Signin],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  getAllUserConsumers() {
    return [this.onUserSignup(), this.onUserSignIn()];
  }
}

export { UserConsumer };
