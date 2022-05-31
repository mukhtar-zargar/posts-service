import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";

const UserServiceTopic = "user_service";

const SignUpEvent = "signup";
const SignInEvent = "signin";

class UserConsumer {
  onUserSignup(): SubscriptionParameters {
    return {
      topic: UserServiceTopic,
      eventTypes: [SignUpEvent],
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
      topic: UserServiceTopic,
      eventTypes: [SignInEvent],
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
