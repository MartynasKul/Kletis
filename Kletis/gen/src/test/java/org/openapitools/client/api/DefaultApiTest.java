/*
 * Kletis Forum API
 * API for the Tractor Forum (Reddit Clone)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package org.openapitools.client.api;

import org.openapitools.client.ApiException;
import org.openapitools.client.model.Comment;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * API tests for DefaultApi
 */
@Disabled
public class DefaultApiTest {

    private final DefaultApi api = new DefaultApi();

    /**
     * Get all comments
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void commentsGetTest() throws ApiException {
        List<Comment> response = api.commentsGet();
        // TODO: test validations
    }

    /**
     * Delete a comment by ID
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void commentsIdDeleteTest() throws ApiException {
        String id = null;
        api.commentsIdDelete(id);
        // TODO: test validations
    }

    /**
     * Get a comment by ID
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void commentsIdGetTest() throws ApiException {
        String id = null;
        Comment response = api.commentsIdGet(id);
        // TODO: test validations
    }

    /**
     * Update a comment by ID
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void commentsIdPutTest() throws ApiException {
        String id = null;
        Comment comment = null;
        api.commentsIdPut(id, comment);
        // TODO: test validations
    }

    /**
     * Create a new comment
     *
     * @throws ApiException if the Api call fails
     */
    @Test
    public void commentsPostTest() throws ApiException {
        Comment comment = null;
        api.commentsPost(comment);
        // TODO: test validations
    }

}
