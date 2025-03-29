import { Card, CardContent, Stack, Typography } from "@mui/material";


export default function FormDetailsDesktop({shopper, role, onClose}) {
    console.log("onClose is:", typeof onClose);

    return (
        <Card
            sx={{ borderRadius: 2, minWidth: 300, boxShadow: 3 }}
        >
            <CardContent
                   sx={{ minWidth: 300 }}>
                <Stack direction='column' spacing={2} sx={{ padding: 3}}>

                    {/* LOGISTICS */}
                    {role !== "User" && (
                        <Typography>Shopper's Name: {shopper.shopperName}</Typography>
                    )}

                    <Typography>
                        Visit Date/Time: {new Date(shopper.dateTime).toLocaleDateString()}
                    </Typography>

                    <Typography>Location: {shopper.location}</Typography>


                    {/* INTERACTION */}
                    <Typography>
                        Cashier's Name: {shopper.cashier}
                    </Typography>

                    <Typography>
                        Wait Time: {shopper.wait}
                    </Typography>

                    <Typography>
                        Greeting: {shopper.greeting === true ? 'Yes' : 'No' }
                    </Typography>

                    <Typography>
                        Repeated Order: {shopper.orderRepeated === true ? 'Yes' : 'No' }
                    </Typography>

                    <Typography>
                        Upsold: {shopper.upsell === true ? 'Yes' : 'No' }
                    </Typography>


                    {/* SCORING */}
                    <Typography>
                        Food Score: {shopper.foodScore}
                    </Typography>
                    <Typography>
                        Service Score: {shopper.serviceScore}
                    </Typography>
                    <Typography>
                        Cleanliness Score: {shopper.cleanScore}
                    </Typography>
                    <Typography>
                        Final Score: {shopper.finalScore}
                    </Typography>


                    {/* REVIEW */}
                    {role !== "User" && (
                        <Typography>comments: {shopper.comments}</Typography>
                    )}

                    <Typography>
                        [ Image Placeholder ]
                    </Typography>

                </Stack>
            </CardContent>
        </Card>
    )

}


