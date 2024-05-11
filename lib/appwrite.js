import {
  Client,
  ID,
  Account,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.khair.ga",
  projectId: "663cbaa5000f4d473a89",
  databaseId: "663cbac90021ed2719e8",
  userCollectionId: "663cbad300017554f2df",
  policeCollectionId: "663ec17a001de7e7fc4e",
};

// Register Userx

// Init your react-native SDK
const client = new Client();
const databases = new Databases(client);
const storage = new Storage(client);

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.
const account = new Account(client);

export const createNewUser = async (
  email,
  password,
  username,
  aadhar,
  address,
  latitude,
  longitude,
  mobile
) => {
  try {
    console.log("f1");
    // Creating a new account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    console.log("f2");
    // Checking if account creation failed
    if (!newAccount) {
      throw new Error("Failed to create account");
    }
    console.log("f3");
    // Generating avatar URL

    // Signing in with the new account
    // await signIn(email, password);

    // Creating a new user document with additional parameters
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        aadhar,
        address,
        latitude,
        longitude,
        mobile,
      }
    );
    console.log("f4");

    // Returning the newly created user
    return newUser;
  } catch (error) {
    // Logging and re-throwing any errors
    console.error("Error occurred during user creation:", error);
    throw error;
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const policeVerification = async ({
  seeker_name,
  seeker_phone,
  helper_name,
  helper_phone,
  latitude,
  longitude,
}) => {
  const newDoc = await databases.createDocument(
    config.databaseId,
    config.policeCollectionId,
    ID.unique(),
    {
      seeker_name,
      seeker_mobile: seeker_phone,
      helper_name,
      helper_mobile: helper_phone,
      latitude,
      longitude,
    }
  );
  return newDoc;
};
export const getNearbyUsers = async () => {
  try {
    const post = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return post.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};
