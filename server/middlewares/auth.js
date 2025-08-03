import { clerkClient } from "@clerk/express";

//Middleware to check userId and hasPremiumP1an

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();
    const hasPremiumP1an = await has({ plan: "premium" });

    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumP1an && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }
    req.plan = hasPremiumP1an ? "premium" : "free";
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
