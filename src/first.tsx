import {
Box,
Button,
FormField,
NumberInput,
Rows,
Text,
TextInput,
LoadingIndicator,
Alert
} from "@canva/app-ui-kit";
import {useEffect, useState} from "react";
import baseStyles from "styles/components.css";


import axios from "axios";


const url = process.env.REACT_APP_MODEL_BACKEND + 'get_image'

function store_in_localStorage(value,index,array){
    localStorage.setItem(index,value);
}


export const GenerateLogoPage = (props) => {

    const [text, setText] = useState<string>("");
    const [num, setNum] = useState<number>(1);

    const [loading,setLoading] = useState<boolean>(false);

    const [alert,setAlert] = useState<string>("");

    async function sendImageRequest() {
        try {
            setLoading(true);
            setAlert("Generating images.... it might take a while....")
            await axios({
                method: 'post',
                url: url,
                data: JSON.stringify({
                  "description": text,
                  "num_image": num
                }),
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
            }).then( res => {
                var images = JSON.parse(res.data)
                localStorage.clear(); // clear all item in local storage
                images.forEach(store_in_localStorage); // save base64 image to local storage
                setLoading(false);
                setAlert("");
                props.goToNextPage();
            })
        }
        catch (err) {
            setLoading(false);
            setAlert(err);
            console.log(err);
        }
    }


    return (
        <div className={baseStyles.scrollContainer}>
        <Rows spacing="2u">

            {alert && <Alert tone="info"> {alert} </Alert>}

            <Text>
            Enter the description of the LOGO you want to generate
            </Text>
            <Box>
            <FormField
                control={(props) => (
                    <TextInput
                    {...props}
                    onChange={setText}
                    />
                )}
                label="Description"
            />
            </Box>

            <Box>
            <FormField
                    control={(props) => (
                    <NumberInput
                    {...props}
                    defaultValue={1}
                    hasSpinButtons={true}
                    step={1}
                    max={6}
                    min={1}
                    onChange={setNum}
                    />
                    )}
                    label="Number of Images"
                />
            </Box>
            

            <Button
            variant="primary"
            onClick={sendImageRequest}
            disabled={loading == true}
            >
            Generate Logo
            </Button>

            {loading && <LoadingIndicator />}


        </Rows>
        </div>
    );
};
