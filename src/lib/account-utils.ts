import axios from "axios";

export const getOrCreateAccountId = async (
  accountName: string,
  ownerName: string = "Rishab Nagwani"
): Promise<number> => {
  if (!accountName.trim()) {
    throw new Error("Account Name is required.");
  }

  try {
    const searchResponse = await axios.get(
      `/api/v1/sobjects/accounts?name=${encodeURIComponent(accountName)}`
    );
    const accounts = searchResponse.data || [];
    const exactMatch = accounts.find(
      (acc: any) => acc.name.toLowerCase() === accountName.toLowerCase()
    );

    if (exactMatch) {
      return exactMatch.id;
    }

    const createResponse = await axios.post("/api/v1/sobjects/accounts", {
      name: accountName,
      account_owner: ownerName,
    });

    if (createResponse.status === 201) {
      return createResponse.data.id;
    }

    throw new Error("Failed to create account");
  } catch (error) {
    console.error("Error in getOrCreateAccountId:", error);
    throw new Error("An error occurred while finding or creating the account.");
  }
};
