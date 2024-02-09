#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
my $cgi = CGI->new;
my $userId = $cgi->param('userID');
if ($userId) {
        my $datos_card = cargar_datos_de_tabla($userId);
        if ($datos_card) {
            print $cgi->header(-type => 'application/json', -status => '200 OK');
            print encode_json($datos_card);
        } else {
            print $cgi->header(-type => 'application/json');
            print '{"error": "No se encontro una tarjeta con el id"}';
        }
}else{
    print $cgi->header(-type => 'application/json');
    print '{"error": "No se recibio el id"}';
}
sub cargar_datos_de_tabla {
    my ($userID) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "SELECT * FROM billing_card WHERE id_cliente = ?";
    my $sth = $dbh->prepare($query);
    $sth->execute($userID);
    my $datos_card = $sth->fetchrow_hashref;
    $sth->finish;
    $dbh->disconnect;
    return $datos_card;
}