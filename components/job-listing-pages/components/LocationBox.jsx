
'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocation } from "../../../features/filter/filterSlice";

const LocationBox = () => {

    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="City or postcode"
                value={getLocation}
                onChange={locationHandler}
            />
            <span className="icon flaticon-map-locator"></span>
        </>
    );
};

export default LocationBox;
