# Apache Flink Java WordCount Example

This example demonstrates a simple WordCount program written in Java using Apache Flink.
It reads a predefined list of sentences, counts the occurrences of each word, and prints the results to the console.

## Prerequisites

*   Java Development Kit (JDK) 11 or later
*   Apache Maven 3.6.0 or later

## Code Overview

The main logic is in `src/main/java/org/example/WordCount.java`.

*   **`WordCount.main()`**:
    *   Sets up the Flink `StreamExecutionEnvironment`.
    *   Creates a `DataStream` from a hardcoded list of sentences.
    *   Processes the stream by:
        *   Tokenizing sentences into words using the `Tokenizer` FlatMapFunction.
        *   Grouping words using `keyBy()`.
        *   Applying a tumbling window (primarily for demonstration with bounded data).
        *   Summing the counts of each word within the windows.
    *   Prints the resulting word counts to standard output.
    *   Executes the Flink job.
*   **`Tokenizer`**: A simple FlatMapFunction that splits sentences into individual words and emits them as `(word, 1)` tuples.

The `pom.xml` file includes the necessary Flink dependencies (`flink-streaming-java`, `flink-clients`) and uses the `maven-shade-plugin` to package the application into an executable JAR.

## Build Instructions

1.  Navigate to the `flink-java-wordcount` directory in your terminal.
2.  Build the project using Maven:

    ```bash
    mvn clean package
    ```

    This command will compile the code and create an executable JAR file in the `target/` directory (e.g., `flink-java-wordcount-1.0-SNAPSHOT.jar`).

## Run Instructions

1.  After building the project, run the JAR file:

    ```bash
    java -jar target/flink-java-wordcount-1.0-SNAPSHOT.jar
    ```

2.  The program will output the word counts to your console. The output will be prefixed by the parallel instance ID and look something like this (order may vary):

    ```
    3> (flink,3)
    3> (is,3)
    3> (example,2)
    4> (world,1)
    2> (hello,2)
    ...
    ```

    The number prefix (e.g., `3>`) indicates the parallel task instance that produced the output. The exact counts depend on the input sentences in `WordCount.java`.
