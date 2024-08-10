import { Box, Button, FormField, Grid, ImageCard ,Rows,ArrowLeftIcon , LoadingIndicator, Slider, Title, Alert} from "@canva/app-ui-kit";
import {upload} from "@canva/asset"
import { addNativeElement } from "@canva/design";


import baseStyles from "styles/components.css";

import { useState } from "react";
import axios from 'axios'


const url = process.env.REACT_APP_MODEL_BACKEND + 'upload_image'



async function uploadSVGToDesignSpace(svgRef) {
    const result = await upload({
        type: "IMAGE",
        mimeType: "image/svg+xml",
        url: svgRef,
        thumbnailUrl: svgRef
    });

    await addNativeElement({
        type: "IMAGE",
        ref: result.ref
    })
}

export const SelectImagePage = (props) => {

    const [imageId, setImageId] = useState<string>("0");
    const [loading, setLoading] = useState<boolean>(false);

    const [svgRef,setSvgRef] = useState<string>('');
    const [blacklevel, setBlacklevel] = useState<number>(0.3);
    const [renderSVG , setRenderSVG] = useState<boolean>(false);

    const [alert, setAlert] = useState<string>("");

    async function sendImageRequest() {
        var imageSrc = localStorage.getItem(imageId);
        try {
            setLoading(true);
            setAlert("Converting image to svg...")
            axios({
                method: 'post',
                url: url,
                data: JSON.stringify({
                    "image": imageSrc,
                    "blacklevel": blacklevel
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
            }).then( res => {
                setLoading(false);
                setAlert("");
                const svgRef = "data:image/svg+xml;base64," + res['data']['svg'];
                setSvgRef(svgRef);
                setRenderSVG(true);
            })
        } catch(err) {
            setLoading(false);
            setAlert(err);
            console.log(err);
        }
    }

    const items = Object.entries(localStorage).map(([key,value]) => {
        return {
            key,
            imageSrc: "data:image/png;base64," + value,
            active: imageId === key,
            onClick: () => {
                setImageId(key)
            }
        }
    })


    return (
        <div className={baseStyles.scrollContainer}>
        <Rows align="start" spacing="1u">
            <Button onClick={props.goToPreviousPage}>
                <ArrowLeftIcon /> To Previous Page
            </Button>
        </Rows>

        <Rows spacing='2u'>
            {alert && <Alert tone="info">{alert}</Alert>}

            <Title size="xsmall"> Select an Image </Title>
            <FormField 
            control={(props) => (
                <Box id={props.id} padding="1u">
                    
                    <Grid columns={2} spacing="1u">
                        {items.map((item) => (
                            <ImageCard
                            ariaLabel="Select Image"
                            key={item.key}
                            thumbnailUrl={item.imageSrc}
                            borderRadius="standard"
                            selectable={true}
                            selected={item.active}
                            onClick={item.onClick}
                            />
                        ))}
                    </Grid>
                </Box>
            )}
            />

            <Box padding="1u">
                <Title size="xsmall"> Black Level </Title>
                <Slider
                defaultValue={blacklevel}
                max={1}
                min={0.1}
                step={0.01}
                onChange={setBlacklevel}
                />
            </Box>

            <Button
            variant="primary"
            onClick={sendImageRequest}>
                Convert to SVG
            </Button>

            
            {loading && <LoadingIndicator />}

            {renderSVG && 
            <Box padding="2u">
                <ImageCard 
                ariaLabel="Add Image to design"
                thumbnailUrl={svgRef}  
                borderRadius="standard"
                selectable={true} 
                onClick={() => uploadSVGToDesignSpace(svgRef)}
                />
            </Box>}

        </Rows>
                    
        </div>
    )
}