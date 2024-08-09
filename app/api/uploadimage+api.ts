export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    console.log("REQ,  ", body);
  } catch (error) {
    console.error(`[API:ERROR:${req.url}]`, error);
  }
};
