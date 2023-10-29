---
title: 'Data provider for Laravel feature test.'
description: 'Using a data provider for a phpunit test within a Laravel feature test.'
pubDate: 'Oct 29 2023'
heroImage: '/blog-placeholder-2.jpg'
url: 'tests-with-data-provider-in-laravel-feature-test'
tags: ['laravel']
---

### What is A Data Provider 

Instead of writing test after test for small changes, in this example to check the validation for a api request, you can instead create an array of the various possibilities.

So first up the data provider itself.
```
   public static function validationDataProvider(): array
    {
        return [
            'text present' => [['text' => ''], 'text'],
            'text too short' => [['text' => 'a'], 'text'],
            'text too long' => [['text' => Str::random(257)], 'text'],
        ];
    }
```

Our actual test would look something like this

```
    /**
     * @test
     *
     * @dataProvider validationDataProvider
     */
    public function a_endpoint_validation_for_various_scenarios(array $formData, string $expectedErrorField): void
    {
        $response = $this->postJson('/api/your/endpoint', $formData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([$expectedErrorField]);
    }
```

This would test the three variations in our example here and save us writing three separate test methods out.

