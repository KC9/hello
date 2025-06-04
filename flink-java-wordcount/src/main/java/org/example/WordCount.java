package org.example;

import org.apache.flink.api.common.functions.FlatMapFunction;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.assigners.TumblingProcessingTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.util.Collector;

import java.util.Arrays;

public class WordCount {

    public static void main(String[] args) throws Exception {
        // 1. Set up the Flink execution environment
        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // 2. Define the data source (hardcoded list of sentences)
        DataStream<String> text = env.fromElements(
                "Hello Flink world",
                "This is a Flink streaming example",
                "Flink is powerful and easy to use",
                "Word count is a classic example",
                "Hello again Flink"
        );

        // 3. Perform the WordCount transformation
        DataStream<Tuple2<String, Integer>> wordCounts = text
                .flatMap(new Tokenizer()) // Tokenize sentences into words
                .keyBy(value -> value.f0) // Group by word
                .window(TumblingProcessingTimeWindows.of(Time.seconds(5))) // Define a 5-second tumbling window (more relevant for unbounded streams)
                .sum(1); // Sum the counts (field at index 1)

        // 4. Print the results to the console
        // The print() sink is suitable for testing and prints to the TaskManager's standard out.
        // In a production environment, you would use a different sink (e.g., Kafka, HDFS, etc.).
        wordCounts.print();

        // 5. Execute the Flink job
        env.execute("Java WordCount Example");
    }

    /**
     * Implements the string tokenizer that splits sentences into words as a user-defined
     * FlatMapFunction. The function takes a line (String) and splits it into
     * multiple pairs in the form of "(word, 1)" (Tuple2<String, Integer>).
     */
    public static final class Tokenizer implements FlatMapFunction<String, Tuple2<String, Integer>> {
        @Override
        public void flatMap(String value, Collector<Tuple2<String, Integer>> out) {
            // Normalize and split the line into words
            String[] tokens = value.toLowerCase().split("\W+");

            // Emit the words
            for (String token : tokens) {
                if (token.length() > 0) {
                    out.collect(new Tuple2<>(token, 1));
                }
            }
        }
    }
}
