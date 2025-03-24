// src/utilities/formValidator.js


// Group-level validation functions for ShopperForm and others

export function validateLogisticsGroup(formData) {
    const { location, shopperName } = formData

    const fieldErrors = {}
    if (location === "") {
        fieldErrors.location = "The location name field needs a value";
    }
    if (shopperName === "") {
        fieldErrors.shopperName = "You must login to complete this form.";
    }

    const isValid =  Object.keys(fieldErrors).length === 0;

    return {
        isValid,
        fieldErrors,
    }
}

export function validateInteractionGroup(formData) {
    const { cashier, wait } = formData

    const fieldErrors = {}
    if (cashier === "") {
        fieldErrors.cashier = "The cashier name field needs a value";
    }
    if (wait === "") {
        fieldErrors.wait = "The wait time field needs a value";
    }

    const isValid =  Object.keys(fieldErrors).length === 0;

    return {
        isValid,
        fieldErrors,
    }

}

export function validateScoringGroup(formData) {
    const { foodScore, cleanScore, serviceScore } = formData

    const fieldErrors = {}
    if (foodScore === "") {
        fieldErrors.foodScore = "A food score is required";
    }
    if (cleanScore === "") {
        fieldErrors.cleanScore = "A cleanliness score is required";
    }

    if (serviceScore === "") {
        fieldErrors.serviceScore = "A service score is required";
    }


    const isValid = Object.keys(fieldErrors).length === 0;

    return {
        isValid,
        fieldErrors,
    }
}

export function validateSubmitReviewGroup(formData, selectedFile) { const { comments } = formData
    const fieldErrors = {}

    if (comments === "") {
        fieldErrors.comments = "The comments field needs a value";
    }

    if (!selectedFile) {
        fieldErrors.upload = "An image is required";
    }

    const isValid =  Object.keys(fieldErrors).length === 0;

    return {
        isValid,
        fieldErrors,
    }
}